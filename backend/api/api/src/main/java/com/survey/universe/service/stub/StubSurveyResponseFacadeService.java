package com.survey.universe.service.stub;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.exception.type.BadRequestException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.DtoToSurveyResponseMapper;
import com.survey.universe.mapper.SurveyResponseToDtoMapper;
import com.survey.universe.service.SurveyResponseFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.spring.util.Base64UrlUtil;
import com.survey.universe.spring.util.UserAuthContextUtil;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.inheritable.ConditionalResponseDto;
import com.survey.universe.web.dto.request.SurveyResponseSubmitDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyResponseFacadeService implements SurveyResponseFacadeService {

	private SurveyService surveyService;
	private Base64UrlUtil base64Url;
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;
	private UserService userService;
	private SurveyResponseToDtoMapper responseToDto;
	private DtoToSurveyResponseMapper dtoToResponse;

	@Override
	public ConditionalResponseDto submitResponse(String urlId, SurveyResponseSubmitDto submitDto) {
		String surveyId = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(surveyId)
				.orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		if (!SurveyStatus.PUBLISHED.equals(survey.getStatus())) {
			throw new BadRequestException("This survey is not accepting responses.");
		}

		SurveyResponse response = dtoToResponse.toSurveyResponse(DocType.RESPOSNSE.join(uuidGenerator.generateUUIDv7()),
				surveyId, UserAuthContextUtil.getCurrentUserId(), survey.getRevision(), submitDto);

		responseService.add(response);

		return survey.getSurveyType().equals(SurveyType.TEST) ? responseToDto.toPersonalSurveyResponseDto(urlId, survey, response)
				: new MessageDto("Answer has been recorded");
	}

	@Override
	public List<UserSurveyResponseDto> getResponses(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);
		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));
		List<SurveyResponse> responses = responseService.findAllBySurveyId(id);
		List<UserSurveyResponseDto> responseDtos = new ArrayList<>();
		for (SurveyResponse response : responses) {
			userService.findById(response.getSurveyId()).ifPresent(user -> {
				responseDtos.add(new UserSurveyResponseDto(response.getId(), urlId,
						base64Url.encode(user.getId(), DocType.SURVEY), survey.getTitle(), response.getSubmittedAt(),
						response.getResponseAnswers()));
			});
		}
		return responseDtos;
	}

	@Override
	public SurveyStatsDto getSurveyStats(String urlId) {
		String surveyId = base64Url.decode(urlId, DocType.SURVEY);
		Survey survey = surveyService.findById(surveyId)
				.orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		List<SurveyResponse> responses = responseService.findAllBySurveyId(surveyId);

		return responseToDto.toSurveyStatsDto(urlId, survey, responses);
	}

	@Override
	public PersonalSurveyResponseDto getUserResponse(String surveyUrlId, String userUrlId) {
		String userId = base64Url.decode(userUrlId, DocType.USER);
		String surveyId = base64Url.decode(surveyUrlId, DocType.SURVEY);

		Survey survey = surveyService.findById(surveyId)
				.orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		List<SurveyResponse> response = responseService.findAllByRespondentId(userId).stream()
				.filter(r -> r.getSurveyId().equals(surveyId)).toList();

		if (response.isEmpty()) {
			throw new ResourceNotFoundException("No response for this survey found fir this user");
		}

		return responseToDto.toPersonalSurveyResponseDto(surveyUrlId, survey, response.getFirst());
	}
}

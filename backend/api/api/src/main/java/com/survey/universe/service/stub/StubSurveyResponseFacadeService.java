package com.survey.universe.service.stub;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.UserResponseStatsSnapshot;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.service.SnapshotService;
import com.survey.universe.exception.type.BadRequestException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.DtoToSurveyResponseMapper;
import com.survey.universe.mapper.SurveyResponseToDtoMapper;
import com.survey.universe.service.SurveyResponseFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
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
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;
	private UserService userService;
	private SurveyResponseToDtoMapper responseToDto;
	private DtoToSurveyResponseMapper dtoToResponse;
	private StubSurveyResponseSnapshotService statsService;
	private SnapshotService snapshotService;

	@Override
	public ConditionalResponseDto submitResponse(String urlId, SurveyResponseSubmitDto submitDto) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!SurveyStatus.PUBLISHED.equals(survey.getStatus())) {
			throw new BadRequestException("This survey is not accepting responses.");
		}

		SurveyResponse response = dtoToResponse.toSurveyResponse(DocType.RESPOSNSE.join(uuidGenerator.generateUUIDv7()),
				survey.getId(), UserAuthContextUtil.getCurrentUserId(), survey.getRevision(), submitDto);

		response = responseService.add(response)
				.orElseThrow(() -> new BadRequestException("You have already submitted a response for this survey"));

		if (response.getIsComplete()) {
			UserResponseStatsSnapshot snapshot = snapshotService.attemptSnapshot(response, survey);

			return survey.getSurveyType().equals(SurveyType.TEST)
					? responseToDto.toPersonalSurveyResponseDto(urlId, survey, snapshot, response)
					: new MessageDto("Answer has been recorded");
		}

		return new MessageDto("Current answers have been saved");

	}

	@Override
	public List<UserSurveyResponseDto> getResponses(String urlId) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		List<SurveyResponse> responses = responseService.findAllBySurveyId(survey.getId());
		List<UserSurveyResponseDto> responseDtos = new ArrayList<>();
		for (SurveyResponse response : responses) {
			userService.findById(response.getSurveyId()).ifPresent(user -> {
				responseDtos.add(new UserSurveyResponseDto(response.getId(), urlId, user.getSlugId(), survey.getTitle(),
						response.getSubmittedAt(), survey.getCategory(), survey.getSurveyType(),
						response.getResponseAnswers()));
			});
		}
		return responseDtos;
	}

	@Override
	public SurveyStatsDto getSurveyStats(String urlId) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		List<SurveyResponse> responses = responseService.findAllBySurveyId(survey.getId());

		List<UserResponseStatsSnapshot> responseStats = new ArrayList<>();
		for (SurveyResponse response : responses) {
			if (!response.getIsComplete()) {
				continue;
			}
			Optional<UserResponseStatsSnapshot> snapshot = statsService.findByResponse(response.getId());
			UserResponseStatsSnapshot snapshotCandidate = snapshot.isEmpty()
					? snapshotService.attemptSnapshot(response, survey)
					: snapshot.get();
			if (snapshotCandidate != null) {
				responseStats.add(snapshotCandidate);
			}
		}
		return responseToDto.toSurveyStatsDto(urlId, survey, responses, responseStats);
	}

	@Override
	public PersonalSurveyResponseDto getUserResponse(String surveyUrlId, String userUrlId) {
		User user = userService.findBySlugId(surveyUrlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		Survey survey = surveyService.findBySlugId(surveyUrlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		List<SurveyResponse> response = responseService.findAllByRespondentId(user.getId()).stream()
				.filter(r -> r.getSurveyId().equals(survey.getId())).toList();

		if (response.isEmpty()) {
			throw new ResourceNotFoundException("No response for this survey found fir this user");
		}

		SurveyResponse responseConcrete = response.getFirst();

		if (responseConcrete.getIsComplete()) {

			Optional<UserResponseStatsSnapshot> snapshot = statsService.findByResponse(responseConcrete.getId());
			UserResponseStatsSnapshot snapshotCandidate = snapshot.isEmpty()
					? snapshotService.attemptSnapshot(responseConcrete, survey)
					: snapshot.get();

			return responseToDto.toPersonalSurveyResponseDto(surveyUrlId, survey, snapshotCandidate, responseConcrete);
		}
		return responseToDto.toPersonalSurveyResponseDto(surveyUrlId, survey, null, responseConcrete);
	}

	@Override
	public List<SurveyStatsDto> filterSurveyStats(String category, TimeRange timeRange) {
		List<Survey> surveys = surveyService.filter(null, null, null, null, null, category, null, timeRange);

		return surveys.stream().map(survey -> getSurveyStats(survey.getSlugId())).toList();
	}
}

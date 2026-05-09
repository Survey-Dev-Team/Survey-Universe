package com.survey.universe.api.service.stub;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.exception.type.BadRequestException;
import com.survey.universe.api.exception.type.ForbiddenException;
import com.survey.universe.api.exception.type.InternalConflictException;
import com.survey.universe.api.exception.type.ResourceNotFoundException;
import com.survey.universe.api.persistence.constant.DocType;
import com.survey.universe.api.persistence.entity.ResponseAnswer;
import com.survey.universe.api.persistence.entity.SurveyResponse;
import com.survey.universe.api.persistence.entity.survey.Option;
import com.survey.universe.api.persistence.entity.survey.Question;
import com.survey.universe.api.persistence.entity.survey.RangeQuestion;
import com.survey.universe.api.persistence.entity.survey.SelectionQuestion;
import com.survey.universe.api.persistence.entity.survey.Survey;
import com.survey.universe.api.persistence.entity.survey.TextAreaQuestion;
import com.survey.universe.api.service.SurveyFacadeService;
import com.survey.universe.api.service.SurveyResponseService;
import com.survey.universe.api.service.SurveyService;
import com.survey.universe.api.service.UserService;
import com.survey.universe.api.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.api.spring.util.Base64UrlUtil;
import com.survey.universe.api.spring.util.UserAuthContextUtil;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.QuestionStatsDto;
import com.survey.universe.api.web.dto.SurveyStatsDto;
import com.survey.universe.api.web.dto.SurveySummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyFacadeService implements SurveyFacadeService {

	private SurveyService surveyService;
	private Base64UrlUtil base64Url;
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;
	private UserService userService;

	@Override
	public SurveyResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto) {
		Survey survey = new Survey();

		survey.setId(DocType.SURVEY.join(uuidGenerator.generateUUIDv7()));
		survey.setTitle(surveyCreateDto.title());
		survey.setDescription(surveyCreateDto.description());
		survey.setCategory(surveyCreateDto.category());
		survey.setEstimatedTime(surveyCreateDto.estimatedTime());
		survey.setHome(surveyCreateDto.isHome());
		survey.setStatus("draft");
		survey.setIcon(surveyCreateDto.icon());
		survey.setCreatorId(UserAuthContextUtil.getCurrentUserId());
		survey.setCreatedAt(Instant.now());
		survey.setModifiedAt(Instant.now());

		normalizeQuestionIds(surveyCreateDto.questions());
		survey.setQuestions(surveyCreateDto.questions());

		Survey savedSurvey = surveyService.add(survey)
				.orElseThrow(() -> new InternalConflictException("Could not create survey, ID already exists"));

		return toResponseDto(savedSurvey);
	}

	@Override
	public SurveyResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		String currentUserId = UserAuthContextUtil.getCurrentUserId();
		if (!survey.getCreatorId().equals(currentUserId)) {
			throw new ForbiddenException("You can only edit your own surveys");
		}

		if (!survey.getRevision().equals(surveyUpdateDto.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		normalizeQuestionIds(surveyUpdateDto.questions());
		applyUpdates(surveyUpdateDto, survey);

		Survey updatedSurvey = surveyService.update(survey)
				.orElseThrow(() -> new InternalConflictException("Could not update survey"));

		return toResponseDto(updatedSurvey);
	}

	private void applyUpdates(SurveyUpdateRequestDto updateRequestDto, Survey survey) {
		Optional.ofNullable(updateRequestDto.title()).ifPresent(survey::setTitle);
		Optional.ofNullable(updateRequestDto.description()).ifPresent(survey::setDescription);
		Optional.ofNullable(updateRequestDto.category()).ifPresent(survey::setCategory);
		Optional.ofNullable(updateRequestDto.estimatedTime()).ifPresent(survey::setEstimatedTime);
		Optional.ofNullable(updateRequestDto.isHome()).ifPresent(survey::setHome);
		Optional.ofNullable(updateRequestDto.status()).ifPresent(s -> {
			if (s.equals("published")) {
				survey.setPublishedAt(Instant.now());
			} else if (s.equals("closed")) {
				survey.setClosedAt(Instant.now());
			} else {
				throw new InternalConflictException("Invalid request");
			}
			survey.setStatus(s);
		});
		Optional.ofNullable(updateRequestDto.questions()).ifPresent(survey::setQuestions);
		Optional.ofNullable(updateRequestDto.icon()).ifPresent(survey::setIcon);
	}

	private SurveyResponseDto toResponseDto(Survey savedSurvey) {
		String urlId = base64Url.encode(savedSurvey.getId(), DocType.SURVEY);

		return new SurveyResponseDto(savedSurvey.getId(), urlId, savedSurvey.getRevision(), savedSurvey.getTitle(),
				savedSurvey.getDescription(), savedSurvey.getIcon(), savedSurvey.getCategory(),
				savedSurvey.getEstimatedTime(), savedSurvey.getQuestions(), savedSurvey.getCreatedAt());
	}

	private void normalizeQuestionIds(List<Question> questions) {
		if (questions == null || questions.isEmpty()) {
			return;
		}
		for (int i = 0; i < questions.size(); i++) {
			Question q = questions.get(i);
			q.setId("q" + (i + 1));
			q.setSortOrder(i + 1);
			if (q instanceof SelectionQuestion sq) {
				List<Option> options = sq.getOptions();
				if (options != null) {
					for (int j = 0; j < options.size(); j++) {
						Option opt = options.get(j);
						opt.setId("opt" + (j + 1));
						opt.setSortOrder(j + 1);
					}
				}
			}
		}
	}

	@Override
	public MessageDto deleteSurvey(String urlId) {
		String id = base64Url.decode(urlId, DocType.USER);

		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		String currentUserId = UserAuthContextUtil.getCurrentUserId();
		if (!survey.getCreatorId().equals(currentUserId)) {
			throw new ForbiddenException("You can only edit your own surveys");
		}

		survey.setDeleted(true);
		surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("User could not be deleted at this time, please try again"));

		return new MessageDto("Survey successfully deleted");
	}

	@Override
	public List<SurveySummaryDto> getAllSurveys() {
		return surveyService.findAllActive().stream().map(s -> toSummaryDto(s)).toList();
	}

	private SurveySummaryDto toSummaryDto(Survey survey) {
		String urlId = base64Url.encode(survey.getId(), DocType.SURVEY);

		return new SurveySummaryDto(urlId, survey.getTitle(), survey.getDescription(), survey.getIcon(),
				survey.getCategory(), survey.getEstimatedTime(), survey.getStatus(), survey.getCreatedAt());
	}

	@Override
	public SurveyResponseDto getSurveyByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		return toResponseDto(survey);
	}

	@Override
	public PagedResponseDto<SurveySummaryDto> getFilteredSurveys(int page, int size, String category, String status,
			String search, String creator) {
		List<Survey> filteredSurveys = surveyService.findAllActive().stream()
				.filter(s -> category == null || s.getCategory().stream().anyMatch(c -> c.equalsIgnoreCase(category)))
				.filter(s -> status == null ? "published".equals(s.getStatus())
						: status.equalsIgnoreCase(s.getStatus()))
				.filter(s -> search == null || s.getTitle().toLowerCase().contains(search.toLowerCase())
						|| s.getDescription().toLowerCase().contains(search.toLowerCase()))
				.filter(s -> creator == null || s.getCreatorId().equals(creator)).toList();

		int totalElements = filteredSurveys.size();
		int totalPages = (int) Math.ceil((double) totalElements / size);
		int fromIndex = page * size;

		List<SurveySummaryDto> content = filteredSurveys.stream().skip(fromIndex).limit(size).map(this::toSummaryDto)
				.toList();

		return new PagedResponseDto<>(content, page, totalPages, totalElements, page < totalPages - 1);
	}

	@Override
	public MessageDto submitResponse(String urlId, @Valid SurveySubmitDto submitDto) {
		String surveyId = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(surveyId)
				.orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		if (!"published".equals(survey.getStatus())) {
			throw new BadRequestException("This survey is not accepting responses.");
		}

		SurveyResponse response = new SurveyResponse();
		response.setId(DocType.RESPOSNSE.join(uuidGenerator.generateUUIDv7()));
		response.setSurveyId(surveyId);
		response.setRespondentId(UserAuthContextUtil.getCurrentUserId()); // Може бути null
		response.setSubmittedAt(Instant.now());
		response.setSurveyRev(survey.getRevision());
		List<ResponseAnswer> answers = submitDto.answers().stream().map(dto -> {
			ResponseAnswer a = new ResponseAnswer();
			a.setId(dto.questionId());
			Optional.of(dto.value()).ifPresent(a::setValue);
			Optional.of(dto.options()).ifPresent(a::setSelectedOptions);
			return a;
		}).toList();
		response.setResponseAnswers(answers);

		responseService.add(response);

		return new MessageDto("Response submitted successfully!");
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

		List<QuestionStatsDto> stats = survey.getQuestions().stream().<QuestionStatsDto>map(q -> {
			List<ResponseAnswer> answers = responses.stream().flatMap(r -> r.getResponseAnswers().stream())
					.filter(a -> a.getId().equals(q.getId())).toList();
			Double average = null;
			List<String> samples = new ArrayList<>();
			Map<String, Long> counts = new HashMap<>();
			if (q instanceof SelectionQuestion) {
				answers.forEach(a -> a.getSelectedOptions().forEach(optId -> {
					counts.merge(optId, 1L, Long::sum);
				}));
			} else if (q instanceof RangeQuestion) {
				average = answers.stream().filter(a -> a.getValue() != null)
						.mapToDouble(a -> Double.parseDouble(a.getValue())).average().orElse(0.0);
			} else if (q instanceof TextAreaQuestion) {
				samples = answers.stream().map(ResponseAnswer::getValue).filter(Objects::nonNull)
						.filter(v -> !v.isBlank()).limit(5).toList();
			}
			return new QuestionStatsDto(q.getId(), q.getLabel(), q.getType(), counts, average, samples);
		}).toList();

		return new SurveyStatsDto(urlId, survey.getTitle(), responses.size(), stats);
	}

}

package com.survey.universe.api.service.stub;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.exception.type.BadRequestException;
import com.survey.universe.api.exception.type.ForbiddenException;
import com.survey.universe.api.exception.type.ResourceNotFoundException;
import com.survey.universe.api.persistence.constant.DocType;
import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.persistence.entity.ResponseAnswer;
import com.survey.universe.api.persistence.entity.SurveyResponse;
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
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
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

	private SurveyResponseDto toResponseDto(Survey savedSurvey) {
		String urlId = base64Url.encode(savedSurvey.getId(), DocType.SURVEY);

		return new SurveyResponseDto(savedSurvey.getId(), urlId, savedSurvey.getRevision(), savedSurvey.getTitle(),
				savedSurvey.getDescription(), savedSurvey.getIcon(), savedSurvey.getCategory(),
				savedSurvey.getEstimatedTime(), savedSurvey.getQuestions(), savedSurvey.getCreatedAt());
	}

	private SurveySummaryDto toSummaryDto(Survey survey) {
		String urlId = base64Url.encode(survey.getId(), DocType.SURVEY);
		String creatorId = survey.getCreatorId();

		return new SurveySummaryDto(urlId, base64Url.encode(creatorId, DocType.USER), survey.getTitle(),
				survey.getDescription(), survey.getIcon(), survey.getCategory(), survey.getEstimatedTime(),
				survey.getPublishedAt());
	}

	@Override
	public SurveyResponseDto getSurveyByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (survey.isDeleted() || !survey.getStatus().equals("published")) {
			throw new ForbiddenException("You do not have authority to access this survey");
		}

		return toResponseDto(survey);
	}

	@Override
	public PagedResponseDto<SurveySummaryDto> getFilteredSurveys(String category, String search, String creator,
			SortOption sortBy, TimeRange timeRange, int page, int size) {
		List<Survey> filteredSurveys = surveyService.findAllActive().stream()
				.filter(s -> category == null || s.getCategory().stream().anyMatch(c -> c.equalsIgnoreCase(category)))
				.filter(s -> "published".equals(s.getStatus())).filter(s -> !s.isDeleted())
				.filter(s -> search == null || s.getTitle().toLowerCase().contains(search.toLowerCase())
						|| s.getDescription().toLowerCase().contains(search.toLowerCase()))
				.filter(s -> creator == null || s.getCreatorId().equals(creator)).filter(s -> {
					if (timeRange == null)
						return true;
					Instant now = Instant.now();
					return switch (timeRange) {
					case TimeRange.today -> s.getCreatedAt().isAfter(now.minus(1, ChronoUnit.DAYS));
					case TimeRange.week -> s.getCreatedAt().isAfter(now.minus(7, ChronoUnit.DAYS));
					case TimeRange.month -> s.getCreatedAt().isAfter(now.minus(30, ChronoUnit.DAYS));
					default -> true;
					};
				}).toList();

		Map<String, Integer> responseCounts = filteredSurveys.stream()
				.collect(Collectors.toMap(Survey::getId, s -> responseService.findAllBySurveyId(s.getId()).size()));

		Comparator<Survey> comparator = switch (sortBy) {
		case SortOption.oldest -> Comparator.comparing(Survey::getCreatedAt);
		case SortOption.popular ->
			Comparator.comparing((Survey s) -> responseCounts.getOrDefault(s.getId(), 0)).reversed();
		default -> Comparator.comparing(Survey::getCreatedAt).reversed();
		};

		int totalElements = filteredSurveys.size();
		int totalPages = (int) Math.ceil((double) totalElements / size);
		int fromIndex = page * size;

		List<SurveySummaryDto> content = filteredSurveys.stream().sorted(comparator).skip(fromIndex).limit(size)
				.map(this::toSummaryDto).toList();

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

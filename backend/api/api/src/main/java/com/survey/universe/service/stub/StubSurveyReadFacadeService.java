package com.survey.universe.service.stub;

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

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.model.ResponseAnswer;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.model.survey.TextAreaQuestion;
import com.survey.universe.exception.type.BadRequestException;
import com.survey.universe.exception.type.ForbiddenException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.SurveyToDtoMapper;
import com.survey.universe.service.SurveyReadFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.service.constant.SortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.spring.util.Base64UrlUtil;
import com.survey.universe.spring.util.UserAuthContextUtil;
import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.QuestionStatsDto;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.SurveySubmitDto;
import com.survey.universe.web.dto.response.PagedResponseDto;
import com.survey.universe.web.dto.response.SurveyReadResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyReadFacadeService implements SurveyReadFacadeService {

	private SurveyService surveyService;
	private Base64UrlUtil base64Url;
	private SurveyResponseService responseService;
	private SurveyToDtoMapper surveyToDto;

	@Override
	public SurveyReadResponseDto getSurveyByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (survey.isDeleted() || !survey.getStatus().equals("published")) {
			throw new ForbiddenException("You do not have authority to access this survey");
		}

		return surveyToDto.toReadResponseDto(survey);
	}

	@Override
	public PagedResponseDto<SurveyReadSummaryDto> getFilteredSurveys(String category, String search, String creator,
			SortOption sortBy, TimeRange timeRange, int page, int size) {
		List<Survey> filteredSurveys = surveyService.findAllActive().stream()
				.filter(s -> category == null || s.getCategory().stream().anyMatch(c -> c.equalsIgnoreCase(category)))
				.filter(s -> SurveyStatus.PUBLISHED.equals(s.getStatus())).filter(s -> !s.isDeleted())
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
		int fromIndex = Math.min(page * size, filteredSurveys.size());

		List<SurveyReadSummaryDto> content = filteredSurveys.stream().sorted(comparator).skip(fromIndex).limit(size)
				.map(surveyToDto::toReadSummaryDto).toList();

		return new PagedResponseDto<>(content, page, totalPages, totalElements, page < totalPages - 1);
	}

}

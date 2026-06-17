package com.survey.universe.service.stub;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.exception.type.ForbiddenException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.PagedDtoMapper;
import com.survey.universe.mapper.SurveyToDtoMapper;
import com.survey.universe.service.SurveyReadFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyReadResponseDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyReadFacadeService implements SurveyReadFacadeService {

	private static List<SurveyStatus> ALLOWED_STATUSES = List.of(SurveyStatus.CLOSED, SurveyStatus.PUBLISHED);

	private SurveyService surveyService;
	private SurveyResponseService responseService;
	private UserService userService;
	private SurveyToDtoMapper surveyToDto;
	private PagedDtoMapper toPaged;

	@Override
	public SurveyReadResponseDto getSurveyByUrlId(String urlId) {

		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (survey.isDeleted() || !survey.getStatus().equals(SurveyStatus.PUBLISHED)) {
			throw new ForbiddenException("You do not have authority to access this survey");
		}

		User creator = userService.findById(survey.getCreatorId())
				.orElseThrow(() -> new ResourceNotFoundException("Resoucrce not found"));

		return surveyToDto.toReadResponseDto(survey, creator);
	}

	@Override
	public PagedResponseDto<SurveyReadSummaryDto> getFilteredSurveys(SurveyStatus surveyStatus, SurveyType surveyType,
			String category, String search, String creator, SurveySortOption sortBy, TimeRange timeRange, int page,
			int size) {
		List<Survey> filtered = surveyService.filter(ALLOWED_STATUSES, surveyType, surveyStatus, creator, search,
				category, false, timeRange);

		List<String> filteredIds = filtered.stream().map(Survey::getId).toList();

		Map<String, Integer> responseCounts = filteredIds.stream()
				.collect(Collectors.toMap(id -> id, id -> responseService.findAllBySurveyId(id).size()));

		Comparator<Survey> comparator = switch (sortBy) {
		case SurveySortOption.oldest -> Comparator.comparing(Survey::getCreatedAt);
		case SurveySortOption.popular ->
			Comparator.comparing((Survey s) -> responseCounts.getOrDefault(s.getId(), 0)).reversed();
		default -> Comparator.comparing(Survey::getCreatedAt).reversed();
		};

		Set<String> creatorIds = filtered.stream().map(Survey::getCreatorId).filter(id -> id != null && !id.isBlank())
				.collect(Collectors.toSet());

		Map<String, User> creatorCache = userService.getAll().stream().filter(u -> creatorIds.contains(u.getId()))
				.collect(Collectors.toMap(User::getId, u -> u, (u1, u2) -> u1));

		return toPaged.toPagedResponse(filtered, comparator, page, size,
				s -> surveyToDto.toReadSummaryDto(s, creatorCache.get(s.getCreatorId())));

	}

	@Override
	public List<SurveyReadSummaryDto> getHomeSurveys() {
		List<Survey> homeSurveys = surveyService.findAllHome();
		if (homeSurveys.isEmpty()) {
			return Collections.emptyList();
		}

		Set<String> creatorIds = homeSurveys.stream().map(Survey::getCreatorId)
				.filter(id -> id != null && !id.isBlank()).collect(Collectors.toSet());

		Map<String, User> creatorCache = userService.getAll().stream().filter(u -> creatorIds.contains(u.getId()))
				.collect(Collectors.toMap(User::getId, u -> u, (u1, u2) -> u1));

		return homeSurveys.stream().map(s -> {
			User creator = creatorCache.get(s.getCreatorId());
			return surveyToDto.toReadSummaryDto(s, creator);
		}).toList();
	}

}

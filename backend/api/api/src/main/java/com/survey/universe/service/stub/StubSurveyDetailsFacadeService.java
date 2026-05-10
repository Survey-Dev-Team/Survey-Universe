package com.survey.universe.service.stub;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.service.SurveyDomainService;
import com.survey.universe.exception.type.InternalConflictException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.DtoToSurveyMapper;
import com.survey.universe.mapper.SurveyToDtoMapper;
import com.survey.universe.service.SurveyDetailsFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.constant.SortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.spring.util.Base64UrlUtil;
import com.survey.universe.spring.util.UserAuthContextUtil;
import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.web.dto.response.PagedResponseDto;
import com.survey.universe.web.dto.response.SurveyDetailsResponseDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyDetailsFacadeService implements SurveyDetailsFacadeService {

	private SurveyService surveyService;
	private Base64UrlUtil base64Url;
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;
	private SurveyDomainService domainService;
	private DtoToSurveyMapper dtoToSurvey;
	private SurveyToDtoMapper surveyToDto;

	@Override
	public SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto) {

		Survey survey = dtoToSurvey.mapPost(surveyCreateDto, DocType.SURVEY.join(uuidGenerator.generateUUIDv7()),
				UserAuthContextUtil.getCurrentUserId());
		domainService.normalizeQuestionIds(survey.getQuestions());
		domainService.setSurveyType(survey);

		Survey savedSurvey = surveyService.add(survey)
				.orElseThrow(() -> new InternalConflictException("Could not create survey, ID already exists"));

		return surveyToDto.toAdminResponseDto(savedSurvey,
				responseService.findAllBySurveyId(savedSurvey.getId()).size());
	}

	@Override
	public SurveyDetailsResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		if (!UserAuthContextUtil.getRole().equals("admin")) {
			domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
		}

		if (!survey.getRevision().equals(surveyUpdateDto.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		dtoToSurvey.mapUpdate(surveyUpdateDto, survey);
		Optional.of(surveyUpdateDto.status()).ifPresent(status -> {
			domainService.updateStatusInstant(survey, status);
		});
		domainService.normalizeQuestionIds(survey.getQuestions());
		domainService.setSurveyType(survey);

		Survey updatedSurvey = surveyService.update(survey)
				.orElseThrow(() -> new InternalConflictException("Could not update survey"));

		return surveyToDto.toAdminResponseDto(updatedSurvey,
				responseService.findAllBySurveyId(updatedSurvey.getId()).size());
	}

	private boolean containsSearchTerm(Survey s, String term) {
		String lowerTerm = term.toLowerCase();
		return s.getTitle().toLowerCase().contains(lowerTerm) || s.getDescription().toLowerCase().contains(lowerTerm);
	}

	private boolean isWithinTimeRange(Instant createdAt, TimeRange range) {
		if (range == null)
			return true;
		Instant limit = switch (range) {
		case today -> Instant.now().minus(1, ChronoUnit.DAYS);
		case week -> Instant.now().minus(7, ChronoUnit.DAYS);
		case month -> Instant.now().minus(30, ChronoUnit.DAYS);
		default -> Instant.MIN;
		};
		return createdAt.isAfter(limit);
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(String status, String creator, String search,
			String category, SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size) {

		List<Survey> allSurveys = surveyService.getAll();

		List<Survey> filtered = allSurveys.stream().filter(s -> showDeleted == null || s.isDeleted() == showDeleted)
				.filter(s -> creator == null || s.getCreatorId().equals(creator))
				.filter(s -> status == null || status.equalsIgnoreCase(String.valueOf(s.getStatus())))
				.filter(s -> category == null || s.getCategory().stream().anyMatch(category::equalsIgnoreCase))
				.filter(s -> search == null || containsSearchTerm(s, search))
				.filter(s -> isWithinTimeRange(s.getCreatedAt(), timeRange)).toList();

		Map<String, Integer> responseCounts = filtered.stream()
				.collect(Collectors.toMap(Survey::getId, s -> responseService.findAllBySurveyId(s.getId()).size()));

		Comparator<Survey> comparator = switch (sortBy) {
		case oldest -> Comparator.comparing(Survey::getCreatedAt);
		case popular -> Comparator.comparing((Survey s) -> responseCounts.getOrDefault(s.getId(), 0)).reversed();
		default -> Comparator.comparing(Survey::getCreatedAt).reversed();
		};

		int totalElements = filtered.size();
		int fromIndex = Math.min(page * size, totalElements);
		int toIndex = Math.min(fromIndex + size, totalElements);

		List<SurveyDetailsSummaryDto> content = filtered.stream().sorted(comparator).collect(Collectors.toList())
				.subList(fromIndex, toIndex).stream()
				.map(s -> surveyToDto.toAdminSummaryDto(s, responseCounts.get(s.getId()))).toList();

		int totalPages = (int) Math.ceil((double) totalElements / size);
		return new PagedResponseDto<>(content, page, totalPages, totalElements, page < totalPages - 1);
	}

	@Override
	public SurveyDetailsResponseDto getSurveyByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		if (!UserAuthContextUtil.getRole().equals("admin")) {
			domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
		}

		return surveyToDto.toAdminResponseDto(survey, responseService.findAllBySurveyId(survey.getId()).size());
	}

	@Override
	public MessageDto deleteSurvey(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id).orElseThrow(() -> new ResourceNotFoundException("Survey not found"));

		if (!UserAuthContextUtil.getRole().equals("admin")) {
			domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
		}

		survey.setDeleted(true);
		surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("User could not be deleted at this time, please try again"));

		return new MessageDto("Survey successfully deleted");
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(String status, String search, String category,
			SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size) {
		return getFilteredSurveys(status, UserAuthContextUtil.getCurrentUserId(), search, category, sortBy, timeRange,
				showDeleted, page, size);
	}

}

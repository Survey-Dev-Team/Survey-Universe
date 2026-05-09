package com.survey.universe.api.service.stub;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.exception.type.BadRequestException;
import com.survey.universe.api.exception.type.ForbiddenException;
import com.survey.universe.api.exception.type.InternalConflictException;
import com.survey.universe.api.exception.type.ResourceNotFoundException;
import com.survey.universe.api.persistence.constant.DocType;
import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.persistence.entity.survey.Option;
import com.survey.universe.api.persistence.entity.survey.Question;
import com.survey.universe.api.persistence.entity.survey.SelectionQuestion;
import com.survey.universe.api.persistence.entity.survey.Survey;
import com.survey.universe.api.service.SurveyAdminFacadeService;
import com.survey.universe.api.service.SurveyResponseService;
import com.survey.universe.api.service.SurveyService;
import com.survey.universe.api.service.UserService;
import com.survey.universe.api.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.api.spring.util.Base64UrlUtil;
import com.survey.universe.api.spring.util.UserAuthContextUtil;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyAdminSummaryDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyAdminResponseDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyAdminFacadeService implements SurveyAdminFacadeService {

	private SurveyService surveyService;
	private Base64UrlUtil base64Url;
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;

	@Override
	public SurveyAdminResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto) {
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

		return toAdminResponseDto(savedSurvey);
	}

	@Override
	public SurveyAdminResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto) {
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

		return toAdminResponseDto(updatedSurvey);
	}

	@Override
	public PagedResponseDto<SurveyAdminSummaryDto> getAdminFilteredSurveys(String status, String creator, String search,
			String category, SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size) {

		List<Survey> filteredSurveys = surveyService.getAll().stream()
				.filter(s -> showDeleted == null || s.isDeleted() == showDeleted)
				.filter(s -> category == null || s.getCategory().stream().anyMatch(c -> c.equalsIgnoreCase(category)))
				.filter(s -> status.equals(s.getStatus()))
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

		List<SurveyAdminSummaryDto> content = filteredSurveys.stream().sorted(comparator).skip(fromIndex).limit(size)
				.map(this::toAdminSummaryDto).toList();

		return new PagedResponseDto<>(content, page, totalPages, totalElements, page < totalPages - 1);
	}

	@Override
	public SurveyAdminResponseDto getAdminSurveyByUrlId(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

		Survey survey = surveyService.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		return toAdminResponseDto(survey);
	}

	@Override
	public MessageDto deleteSurvey(String urlId) {
		String id = base64Url.decode(urlId, DocType.SURVEY);

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
				throw new BadRequestException("Invalid request");
			}
			survey.setStatus(s);
		});
		Optional.ofNullable(updateRequestDto.questions()).ifPresent(survey::setQuestions);
		Optional.ofNullable(updateRequestDto.icon()).ifPresent(survey::setIcon);
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

	private SurveyAdminSummaryDto toAdminSummaryDto(Survey survey) {
		String urlId = base64Url.encode(survey.getId(), DocType.SURVEY);
		String creatorId = survey.getCreatorId();

		return new SurveyAdminSummaryDto(survey.getId(), urlId, creatorId, base64Url.encode(creatorId, DocType.USER),
				survey.getTitle(), survey.getDescription(), survey.getIcon(), survey.getCategory(),
				survey.getEstimatedTime(), survey.getPublishedAt(), survey.getClosedAt(), survey.getCreatedAt(),
				survey.getModifiedAt(), survey.getStatus(), survey.isDeleted(),
				Integer.valueOf(responseService.findAllBySurveyId(survey.getId()).size()));

	}

	private SurveyAdminResponseDto toAdminResponseDto(Survey survey) {
		return new SurveyAdminResponseDto(toAdminSummaryDto(survey), survey.getRevision(), survey.getQuestions());

	}

}

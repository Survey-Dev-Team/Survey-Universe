package com.survey.universe.service.stub;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.service.SurveyDomainService;
import com.survey.universe.exception.type.BadRequestException;
import com.survey.universe.exception.type.InternalConflictException;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.exception.type.UnauthorizedException;
import com.survey.universe.mapper.DtoToSurveyMapper;
import com.survey.universe.mapper.PagedDtoMapper;
import com.survey.universe.mapper.SurveyToDtoMapper;
import com.survey.universe.service.SurveyDetailsFacadeService;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.spring.util.UserAuthContextUtil;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.auth.request.SurveyHomePatchDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.generic.RevisionMessageDto;
import com.survey.universe.web.dto.generic.RevisionRecordDto;
import com.survey.universe.web.dto.request.survey.AdminSurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyDetailsResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyUpdateRequestDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyDetailsFacadeService implements SurveyDetailsFacadeService {

	private static final List<SurveyStatus> ALLOWED_STATUSES = List.of(SurveyStatus.CLOSED, SurveyStatus.DRAFT,
			SurveyStatus.PUBLISHED);

	private final SurveyService surveyService;
	private final UUIDGenerator uuidGenerator;
	private final SurveyResponseService responseService;
	private final UserService userService;
	private final SurveyDomainService domainService;
	private final DtoToSurveyMapper dtoToSurvey;
	private final SurveyToDtoMapper surveyToDto;
	private final PagedDtoMapper toPaged;

	private SurveyDetailsResponseDto createSurveyInternal(SurveyCreateRequestDto surveyCreateDto, SurveyStatus status) {
		try {
			String creatorId = UserAuthContextUtil.getCurrentUserId();

			if (creatorId == null || creatorId.isBlank()) {
				throw new UnauthorizedException("User session context is missing or invalid.");
			}

			User creator = userService.findById(creatorId).orElseThrow(
					() -> new ResourceNotFoundException("Logged-in creator profile not found in database."));

			String generatedId = "survey:" + uuidGenerator.generateUUIDv7();

			Survey survey = dtoToSurvey.mapPost(surveyCreateDto, generatedId, creatorId, status);

			survey.setId(generatedId);
			survey.setRevision(null);

			survey.setRootType("survey");
			survey.setDeleted(false);
			survey.setHome(false);
			survey.setCreatedAt(Instant.now());
			survey.setModifiedAt(Instant.now());

			if (survey.getCategory() == null)
				survey.setCategory(new ArrayList<>());
			if (survey.getQuestions() == null)
				survey.setQuestions(new ArrayList<>());

			domainService.normalizeQuestionIds(survey.getQuestions());

			if (surveyCreateDto.type() != null) {
				try {
					survey.setSurveyType(SurveyType.valueOf(surveyCreateDto.type().toLowerCase()));
				} catch (IllegalArgumentException e) {
					survey.setSurveyType(SurveyType.QUESTIONNAIRE);
				}
			} else {
				domainService.setSurveyType(survey);
			}

			Survey savedSurvey = surveyService.add(survey).orElseThrow(() -> new InternalConflictException(
					"Could not create survey due to a database conflict, please try again."));

			int responseCount = responseService.findAllBySurveyId(savedSurvey.getId()).size();
			return surveyToDto.toAdminResponseDto(savedSurvey, creator, responseCount);

		} catch (Exception e) {
			System.err.println("--- Error saving a Survey ---");
			System.err.println("Reason: " + e.getMessage());
			e.printStackTrace();
			System.err.println("----------------------------------------------");

			if (e instanceof RuntimeException)
				throw (RuntimeException) e;
			throw new RuntimeException(e);
		}
	}

	@Override
	public SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto) {
		SurveyStatus finalStatus = surveyCreateDto.status() != null ? surveyCreateDto.status() : SurveyStatus.DRAFT;
		return createSurveyInternal(surveyCreateDto, finalStatus);
	}

	@Override
	public SurveyDetailsResponseDto createSurvey(AdminSurveyCreateRequestDto surveyCreateDto) {
		return createSurveyInternal(surveyCreateDto.surveyData(), surveyCreateDto.status());
	}

	@Override
	public SurveyDetailsResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto) {
		Survey survey = surveyService.findById(urlId).or(() -> surveyService.findBySlugId(urlId))
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		User creator = userService.findById(survey.getCreatorId())
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			if (survey.getStatus() == SurveyStatus.DRAFT) {
				domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
			} else {
				throw new BadRequestException("You can only edit drafted surveys");
			}
		}

		if (!survey.getRevision().equals(surveyUpdateDto.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		Survey freshSurvey = surveyService.findById(survey.getId()).orElse(survey);

		dtoToSurvey.mapUpdate(surveyUpdateDto, freshSurvey);
		freshSurvey.setModifiedAt(Instant.now());
		domainService.normalizeQuestionIds(freshSurvey.getQuestions());

		if (surveyUpdateDto.type() != null) {
			try {
				freshSurvey.setSurveyType(SurveyType.valueOf(surveyUpdateDto.type().toLowerCase()));
			} catch (IllegalArgumentException e) {
				freshSurvey.setSurveyType(SurveyType.QUESTIONNAIRE);
			}
		} else {
			domainService.setSurveyType(freshSurvey);
		}

		Survey updatedSurvey = surveyService.update(freshSurvey)
				.orElseThrow(() -> new InternalConflictException("Could not update survey"));

		int responseCount = responseService.findAllBySurveyId(updatedSurvey.getId()).size();
		return surveyToDto.toAdminResponseDto(updatedSurvey, creator, responseCount);
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status,
			String creator, String search, String category, SurveySortOption sortBy, TimeRange timeRange,
			Boolean showDeleted, int page, int size) {

		List<Survey> filtered = surveyService.filter(ALLOWED_STATUSES, surveyType, status, creator, search, category,
				showDeleted, timeRange);

		Map<String, Integer> responseCounts = filtered.stream().map(Survey::getId)
				.collect(Collectors.toMap(id -> id, id -> responseService.findAllBySurveyId(id).size(), (a, b) -> a));

		Comparator<Survey> comparator = switch (sortBy) {
		case oldest -> Comparator.comparing(Survey::getCreatedAt);
		case popular -> Comparator.comparing((Survey s) -> responseCounts.getOrDefault(s.getId(), 0)).reversed();
		default -> Comparator.comparing(Survey::getCreatedAt).reversed();
		};

		Set<String> creatorIds = filtered.stream().map(Survey::getCreatorId).filter(id -> id != null && !id.isBlank())
				.collect(Collectors.toSet());

		Map<String, User> creatorCache = userService.getAll().stream().filter(u -> creatorIds.contains(u.getId()))
				.collect(Collectors.toMap(User::getId, u -> u, (u1, u2) -> u1));

		return toPaged.toPagedResponse(filtered, comparator, page, size, s -> surveyToDto.toAdminSummaryDto(s,
				creatorCache.get(s.getCreatorId()), responseCounts.getOrDefault(s.getId(), 0)));
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status,
			String search, String category, SurveySortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page,
			int size) {
		return getFilteredSurveys(surveyType, status, UserAuthContextUtil.getCurrentUserId(), search, category, sortBy,
				timeRange, showDeleted, page, size);
	}

	@Override
	public SurveyDetailsResponseDto getSurveyByUrlId(String urlId) {
		Survey survey = surveyService.findById(urlId).or(() -> surveyService.findBySlugId(urlId))
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		User creator = userService.findById(survey.getCreatorId())
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
		}

		int responseCount = responseService.findAllBySurveyId(survey.getId()).size();
		return surveyToDto.toAdminResponseDto(survey, creator, responseCount);
	}

	@Override
	public MessageDto deleteSurvey(String urlId) {
		Survey survey = surveyService.findById(urlId).or(() -> surveyService.findBySlugId(urlId))
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			if (survey.getStatus() == SurveyStatus.DRAFT) {
				domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
			} else {
				throw new BadRequestException("You can only delete drafted surveys");
			}
		}

		Survey fresh = surveyService.findById(survey.getId()).orElse(survey);
		fresh.setDeleted(true);
		fresh.setModifiedAt(Instant.now());

		surveyService.update(fresh).orElseThrow(
				() -> new InternalConflictException("Survey could not be deleted at this time, please try again"));
		return new MessageDto("Survey successfully deleted");
	}

	@Override
	public RevisionMessageDto publishSurvey(String urlId, RevisionRecordDto revision) {
		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}
		return changeSurveyStatus(urlId, revision.revision(), SurveyStatus.PUBLISHED,
				(Survey s) -> s.setPublishedAt(Instant.now()));
	}

	@Override
	public RevisionMessageDto closeSurvey(String urlId, RevisionRecordDto revision) {
		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}
		return changeSurveyStatus(urlId, revision.revision(), SurveyStatus.CLOSED,
				(Survey s) -> s.setClosedAt(Instant.now()));
	}

	@Override
	public RevisionMessageDto draftSurvey(String urlId, RevisionRecordDto revision) {
		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}
		return changeSurveyStatus(urlId, revision.revision(), SurveyStatus.DRAFT, (Survey s) -> {
		});
	}

	@Override
	public RevisionMessageDto setHome(String urlId, SurveyHomePatchDto revision) {
		if (!"admin".equalsIgnoreCase(UserAuthContextUtil.getRole())) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}
		Survey survey = surveyService.findById(urlId).or(() -> surveyService.findBySlugId(urlId))
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		if (!survey.getRevision().equals(revision.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}
		Survey fresh = surveyService.findById(survey.getId()).orElse(survey);
		fresh.setHome(revision.isHome());
		fresh.setModifiedAt(Instant.now());
		Survey updated = surveyService.update(fresh).orElseThrow(
				() -> new InternalConflictException("Survey could not be updated at this time, please try again"));
		String msg = "Survey will now " + (revision.isHome() ? "" : "no longer ") + "be on the homepage";
		return new RevisionMessageDto(msg, updated.getRevision(), updated.getSlugId(), urlId);
	}

	private RevisionMessageDto changeSurveyStatus(String urlId, String expectedRevision, SurveyStatus targetStatus,
			java.util.function.Consumer<Survey> customModifier) {

		Survey survey = surveyService.findById(urlId).or(() -> surveyService.findBySlugId(urlId))
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!survey.getRevision().equals(expectedRevision)) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		Survey fresh = surveyService.findById(survey.getId()).orElse(survey);
		fresh.setStatus(targetStatus);
		fresh.setModifiedAt(Instant.now());

		customModifier.accept(fresh);

		Survey updated = surveyService.update(fresh).orElseThrow(
				() -> new InternalConflictException("Survey could not be updated at this time, please try again"));

		String successMessage = "Survey sucessfully " + targetStatus.name().toLowerCase();
		return new RevisionMessageDto(successMessage, updated.getRevision(), updated.getId(), urlId);
	}

}

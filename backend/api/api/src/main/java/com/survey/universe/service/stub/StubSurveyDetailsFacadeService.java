package com.survey.universe.service.stub;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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

	private static List<SurveyStatus> ALLOWED_STATUSES = List.of(SurveyStatus.CLOSED, SurveyStatus.DRAFT,
			SurveyStatus.PUBLISHED);

	private SurveyService surveyService;
	private UUIDGenerator uuidGenerator;
	private SurveyResponseService responseService;
	private UserService userService;
	private SurveyDomainService domainService;
	private DtoToSurveyMapper dtoToSurvey;
	private SurveyToDtoMapper surveyToDto;
	private PagedDtoMapper toPaged;
	
	
	private SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto, SurveyStatus status) {
		String creatorId = UserAuthContextUtil.getCurrentUserId();

		User creator = userService.findById(creatorId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		Survey survey = dtoToSurvey.mapPost(surveyCreateDto, DocType.SURVEY.join(uuidGenerator.generateUUIDv7()),
				creatorId, status);
		domainService.normalizeQuestionIds(survey.getQuestions());
		domainService.setSurveyType(survey);

		Survey savedSurvey = surveyService.add(survey).orElseThrow(
				() -> new InternalConflictException("Could not create survey at this time, please try again"));

		return surveyToDto.toAdminResponseDto(savedSurvey, creator,
				responseService.findAllBySurveyId(savedSurvey.getId()).size());
	}

	@Override
	public SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto) {
		return createSurvey(surveyCreateDto, SurveyStatus.DRAFT);
	}
	
	@Override
	public SurveyDetailsResponseDto createSurvey(AdminSurveyCreateRequestDto surveyCreateDto) {
		return createSurvey(surveyCreateDto.surveyData(), surveyCreateDto.status());
	}
	
	@Override
	public SurveyDetailsResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		User creator = userService.findById(survey.getCreatorId())
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!UserAuthContextUtil.getRole().equals("admin")) {
			if (survey.getStatus().equals(SurveyStatus.DRAFT)) {
				domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
			} else {
				throw new BadRequestException("You can only edit drafted surveys");
			}
		}

		if (!survey.getRevision().equals(surveyUpdateDto.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		dtoToSurvey.mapUpdate(surveyUpdateDto, survey);
		domainService.normalizeQuestionIds(survey.getQuestions());
		domainService.setSurveyType(survey);

		survey = surveyService.update(survey)
				.orElseThrow(() -> new InternalConflictException("Could not update survey"));

		return surveyToDto.toAdminResponseDto(survey, creator,
				responseService.findAllBySurveyId(survey.getId()).size());
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status,
			String creator, String search, String category, SurveySortOption sortBy, TimeRange timeRange,
			Boolean showDeleted, int page, int size) {

		List<Survey> filtered = surveyService.filter(ALLOWED_STATUSES, surveyType, status, creator, search, category,
				showDeleted, timeRange);

		List<String> filteredIds = filtered.stream().map(Survey::getId).toList();

		Map<String, Integer> responseCounts = filteredIds.stream()
				.collect(Collectors.toMap(id -> id, id -> responseService.findAllBySurveyId(id).size()));

		Comparator<Survey> comparator = switch (sortBy) {
		case oldest -> Comparator.comparing(Survey::getCreatedAt);
		case popular -> Comparator.comparing((Survey s) -> responseCounts.getOrDefault(s.getId(), 0)).reversed();
		default -> Comparator.comparing(Survey::getCreatedAt).reversed();
		};

		return toPaged.toPagedResponse(filtered, comparator, page, size,
				s -> surveyToDto.toAdminSummaryDto(s,
						userService.findById(s.getCreatorId())
								.orElseThrow(() -> new ResourceNotFoundException("Resource not found")),
						responseCounts.get(s.getId())));
	}

	@Override
	public SurveyDetailsResponseDto getSurveyByUrlId(String urlId) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		User creator = userService.findById(survey.getCreatorId())
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		
		if (!UserAuthContextUtil.getRole().equals("admin")) {
			domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
		}

		return surveyToDto.toAdminResponseDto(survey, creator, responseService.findAllBySurveyId(survey.getId()).size());
	}

	@Override
	public MessageDto deleteSurvey(String urlId) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		
		if (!UserAuthContextUtil.getRole().equals("admin")) {
			if (survey.getStatus().equals(SurveyStatus.DRAFT)) {
				domainService.validateOwnership(survey, UserAuthContextUtil.getCurrentUserId());
			} else {
				throw new BadRequestException("You can only delete drafted surveys");
			}
		}

		survey.setDeleted(true);
		surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("Survey could not be deleted at this time, please try again"));

		return new MessageDto("Survey successfully deleted");
	}

	@Override
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status,
			String search, String category, SurveySortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page,
			int size) {
		return getFilteredSurveys(surveyType, status, UserAuthContextUtil.getCurrentUserId(), search, category, sortBy,
				timeRange, showDeleted, page, size);
	}

	@Override
	public RevisionMessageDto publishSurvey(String urlId, RevisionRecordDto revision) {
		if (!UserAuthContextUtil.getRole().equals("admin")) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}

		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
		
		if (!survey.getRevision().equals(revision.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}

		survey.setStatus(SurveyStatus.PUBLISHED);
		survey.setPublishedAt(Instant.now());

		survey = surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("Survey could not be published at this time, please try again"));

		return new RevisionMessageDto("Survey sucessfully published", survey.getRevision(), survey.getId(), urlId);
	}

	@Override
	public RevisionMessageDto closeSurvey(String urlId, RevisionRecordDto revision) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!survey.getRevision().equals(revision.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}
		survey.setStatus(SurveyStatus.CLOSED);
		survey.setClosedAt(Instant.now());

		survey = surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("Survey could not be closed at this time, please try again"));

		return new RevisionMessageDto("Survey sucessfully closed", survey.getRevision(), survey.getId(), urlId);
	}

	@Override
	public RevisionMessageDto draftSurvey(String urlId, RevisionRecordDto revision) {
		if (!UserAuthContextUtil.getRole().equals("admin")) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}

		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!survey.getRevision().equals(revision.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}
		survey.setStatus(SurveyStatus.DRAFT);

		survey = surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("Survey could not be drafted at this time, please try again"));

		return new RevisionMessageDto("Survey sucessfully drafted", survey.getRevision(), survey.getId(), urlId);
	}

	@Override
	public RevisionMessageDto setHome(String urlId, SurveyHomePatchDto revision) {
		if (!UserAuthContextUtil.getRole().equals("admin")) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}

		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		if (!survey.getRevision().equals(revision.revision())) {
			throw new InternalConflictException("Survey was modified by someone else. Please refresh");
		}
		survey.setHome(revision.isHome());

		survey = surveyService.update(survey).orElseThrow(
				() -> new InternalConflictException("Survey could not be drafted at this time, please try again"));

		return new RevisionMessageDto(
				"Survey will now " + (revision.isHome() ? "" : "no longer") + " be on the homepage",
				survey.getRevision(), survey.getSlugId(), urlId);
	}

}

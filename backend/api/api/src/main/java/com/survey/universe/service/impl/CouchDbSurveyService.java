package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.repository.CouchDbSurveyRepository;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.SlugIdGenerator;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import org.springframework.context.annotation.Primary;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Primary
@AllArgsConstructor
public class CouchDbSurveyService implements SurveyService {

	private final CouchDbSurveyRepository surveyRepository;
	private final SlugIdGenerator slugGenerator;
	private final UUIDGenerator uuidGenerator;

	@Override
	public Optional<Survey> findById(String id) {
		return surveyRepository.findById(id);
	}

	@Override
	public List<Survey> findAllByCreator(String creatorId) {
		return surveyRepository.findByView("public_by_author", creatorId);
	}

	@Override
	public List<Survey> findActiveByCreator(String creatorId) {
		return findAllByCreator(creatorId).stream().filter(s -> !s.isDeleted()).toList();
	}

	@Override
	public Optional<Survey> add(Survey survey) {
	    if (survey.getId() == null || survey.getId().isBlank()) {
	        survey.setId(DocType.SURVEY.join(uuidGenerator.generateUUIDv7()));
	    }

	    survey.setRevision(null); 
	    
	    survey.setSlugId(slugGenerator.generate());
	    survey.setCreatedAt(Instant.now());
	    survey.setModifiedAt(Instant.now());

	    return surveyRepository.save(survey);
	}


	@Override
	public Optional<Survey> update(Survey survey) {
		Optional<Survey> surveyOpt = findById(survey.getId());
		if (surveyOpt.isEmpty()) {
			return Optional.empty();
		}

		Survey currentDbSurvey = surveyOpt.get();

		survey.setRevision(currentDbSurvey.getRevision());
		survey.setCreatedAt(currentDbSurvey.getCreatedAt());
		survey.setModifiedAt(Instant.now());

		return surveyRepository.save(survey);
	}

	@Override
	public List<Survey> findAllActive() {
		return surveyRepository.getAll().stream().filter(s -> !s.isDeleted()).toList();
	}

	@Override
	public List<Survey> findAllHome() {
		return surveyRepository.getAll().stream().filter(s -> s.isHome() && !s.isDeleted()).toList();
	}

	@Override
	public List<Survey> findByStatus(SurveyStatus status) {
		String statusKey = status != null ? status.name().toLowerCase() : "";
		return surveyRepository.findByView("public_by_status", statusKey);
	}

	@Override
	public List<Survey> getAll() {
		return surveyRepository.getAll();
	}

	@Override
	public Optional<Survey> findBySlugId(String slugId) {
		return surveyRepository.findByField("slug_id", slugId);
	}

	@Override
	public List<Survey> filter(List<SurveyStatus> allowedStatuses, SurveyType surveyType, SurveyStatus status,
			String creator, String search, String category, Boolean showDeleted, TimeRange timeRange) {

		boolean activeShowDeleted = Boolean.TRUE.equals(showDeleted);

		return getAll().stream().filter(s -> s.getStatus() != null && allowedStatuses.contains(s.getStatus()))
				.filter(s -> !s.isDeleted() || activeShowDeleted)
				.filter(s -> surveyType == null || surveyType.equals(s.getSurveyType()))
				.filter(s -> status == null || status.equals(s.getStatus()))
				.filter(s -> creator == null || creator.equals(s.getCreatorId()))
				.filter(s -> category == null || (s.getCategory() != null && s.getCategory().contains(category)))
				.filter(s -> isWithinTimeRange(s.getCreatedAt(), timeRange)).filter(s -> containsSearchTerm(s, search))
				.toList();
	}

	private boolean containsSearchTerm(Survey s, String term) {
		if (term == null || term.isBlank())
			return true;
		String lowerTerm = term.toLowerCase();
		String title = s.getTitle() != null ? s.getTitle().toLowerCase() : "";
		String desc = s.getDescription() != null ? s.getDescription().toLowerCase() : "";
		return title.contains(lowerTerm) || desc.contains(lowerTerm);
	}

	private boolean isWithinTimeRange(Instant createdAt, TimeRange range) {
		if (range == null || createdAt == null)
			return true;
		Instant limit = switch (range) {
		case today -> Instant.now().minus(1, ChronoUnit.DAYS);
		case week -> Instant.now().minus(7, ChronoUnit.DAYS);
		case month -> Instant.now().minus(30, ChronoUnit.DAYS);
		default -> Instant.MIN;
		};
		return createdAt.isAfter(limit);
	}
}

package com.survey.universe.service.stub;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.stub.provider.StubSurveysProvider;
import com.survey.universe.domain.stub.storage.StubSurveyStorage;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.spring.configuration.bean.SlugIdGenerator;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyService implements SurveyService {

	private final StubSurveyStorage surveys;

	private final StubSurveysProvider provider;
	
	private SlugIdGenerator slugGenerator;

	@PostConstruct
	private void initialize() {
		for (Survey survey : provider.getAll()) {
			add(survey);
		}
	}

	@Override
	public Optional<Survey> findById(String id) {
		return surveys.findById(id);
	}

	@Override
	public List<Survey> findAllByCreator(String creatorId) {
		return surveys.findAllByCreator(creatorId);
	}

	@Override
	public List<Survey> findActiveByCreator(String creatorId) {
		return surveys.findActiveByCreator(creatorId);
	}

	@Override
	public Optional<Survey> add(Survey survey) {
		String id = survey.getId();
		survey.setSlugId(slugGenerator.generate());
		if (findById(id).isPresent()) {
			return Optional.empty();
		}
		survey.setRevision("1-stub");
		return surveys.add(survey);
	}

	@Override
	public Optional<Survey> update(Survey survey) {
		Optional<Survey> surveyOpt = findById(survey.getId());
		if (surveyOpt.isEmpty()) {
			return Optional.empty();
		}
		String currentRev = survey.getRevision();
		int revNum = currentRev != null && currentRev.contains("-") ? Integer.parseInt(currentRev.split("-")[0]) : 0;
		survey.setRevision((revNum + 1) + "-stub");
		survey.setModifiedAt(Instant.now());
		return surveys.update(survey.getId(), survey);
	}

	@Override
	public List<Survey> findAllActive() {
		return surveys.findAllActive();
	}

	@Override
	public List<Survey> findAllHome() {
		return surveys.findAllHome();
	}

	@Override
	public List<Survey> findByStatus(SurveyStatus status) {
		return surveys.findByStatus(status);
	}

	@Override
	public List<Survey> getAll() {
		return surveys.getAll();
	}

	private boolean containsSearchTerm(Survey s, String term) {
		if (term == null || term.isBlank()) {
			return true;
		}
		String lowerTerm = term.toLowerCase();
		String title = s.getTitle() != null ? s.getTitle().toLowerCase() : "";
		String desc = s.getDescription() != null ? s.getDescription().toLowerCase() : "";
		return title.contains(lowerTerm) || desc.contains(lowerTerm);
	}

	private boolean isWithinTimeRange(Instant createdAt, TimeRange range) {
		if (range == null || createdAt == null) {
			return true;
		}
		Instant limit = switch (range) {
		case today -> Instant.now().minus(1, ChronoUnit.DAYS);
		case week -> Instant.now().minus(7, ChronoUnit.DAYS);
		case month -> Instant.now().minus(30, ChronoUnit.DAYS);
		default -> Instant.MIN;
		};
		return createdAt.isAfter(limit);
	}

	@Override
	public List<Survey> filter(List<SurveyStatus> allowedStatuses, SurveyType surveyType, SurveyStatus status,
			String creator, String search, String category, Boolean showDeleted, TimeRange timeRange) {
		
		
		return getAll().stream().filter(s -> allowedStatuses.contains(s.getStatus()))
				.filter(s -> s.isDeleted() == false || s.isDeleted() == showDeleted)
				.filter(s -> surveyType == null ||  surveyType.equals(s.getSurveyType()))
				.filter(s -> status == null || status.equals(s.getStatus()))
				.filter(s -> creator == null || creator.equals(s.getCreatorId()))
				.filter(s -> category == null || (s.getCategory() != null && s.getCategory().contains(category)))
				.filter(s -> isWithinTimeRange(s.getCreatedAt(), timeRange)).filter(s -> containsSearchTerm(s, search))
				.toList();
	}

	@Override
	public Optional<Survey> findBySlugId(String slugId) {
		return surveys.findBySlugId(slugId);
	}

}

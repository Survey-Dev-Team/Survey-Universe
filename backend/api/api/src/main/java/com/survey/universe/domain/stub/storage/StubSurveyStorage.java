package com.survey.universe.domain.stub.storage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.model.survey.Survey;

@Service
@Profile("test")
public class StubSurveyStorage {

	private final Map<String, Survey> surveyStorage = new ConcurrentHashMap<>();

	public Optional<Survey> findById(String id) {
		return Optional.ofNullable(surveyStorage.get(id));
	}

	public List<Survey> findAllByCreator(String creatorId) {
		return surveyStorage.values().stream().filter(s -> s.getCreatorId().equals(creatorId)).toList();
	}

	public List<Survey> findActiveByCreator(String creatorId) {
		return surveyStorage.values().stream().filter(s -> s.getCreatorId().equals(creatorId))
				.filter(s -> !s.isDeleted()).toList();

	}

	public Optional<Survey> add(Survey survey) {
		surveyStorage.put(survey.getId(), survey);
		return Optional.of(survey);
	}

	public Optional<Survey> update(String id, Survey survey) {
		surveyStorage.put(survey.getId(), survey);
		return Optional.of(survey);
	}

	public List<Survey> findAllActive() {
		return surveyStorage.values().stream().filter(s -> !s.isDeleted()).toList();

	}

	public List<Survey> findAllHome() {
		return surveyStorage.values().stream().filter(s -> s.isHome()).filter(s -> !s.isDeleted()).toList();

	}

	public List<Survey> findByStatus(SurveyStatus status) {
		return surveyStorage.values().stream().filter(s -> s.getStatus().equals(status)).filter(s -> !s.isDeleted())
				.toList();
	}

	public List<Survey> getAll() {
		return new ArrayList<>(surveyStorage.values());
	}

	public Optional<Survey> findBySlugId(String slugId) {
		List<Survey> slugCandidates = surveyStorage.values().stream().filter(s -> s.getSlugId().equals(slugId))
				.toList();
		return slugCandidates.size() == 0 ? Optional.empty() : Optional.of(slugCandidates.getFirst());
	}
}

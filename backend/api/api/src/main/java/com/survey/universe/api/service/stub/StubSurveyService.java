package com.survey.universe.api.service.stub;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.persistence.entity.survey.Survey;
import com.survey.universe.api.persistence.stub.StubSurveyStorage;
import com.survey.universe.api.service.SurveyService;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyService implements SurveyService {

	private final StubSurveyStorage surveys;

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
	public List<Survey> findByStatus(String status) {
		return surveys.findByStatus(status);
	}

	@Override
	public List<Survey> getAll() {
		return surveys.getAll();
	}

	
}

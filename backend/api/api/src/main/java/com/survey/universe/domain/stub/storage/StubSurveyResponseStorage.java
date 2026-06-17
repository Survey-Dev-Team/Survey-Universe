package com.survey.universe.domain.stub.storage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.SurveyResponse;

@Service
@Profile("test")
public class StubSurveyResponseStorage {
	private final Map<String, SurveyResponse> responseStorage = new ConcurrentHashMap<>();

	public void add(SurveyResponse response) {
		responseStorage.put(response.getId(), response);
	}
		
	public List<SurveyResponse> findAllBySurveyId(String surveyId) {
		return responseStorage.values().stream().filter(r -> r.getSurveyId().equals(surveyId)).toList();
	}

	public Optional<SurveyResponse> findByResponseId(String id) {
		return Optional.ofNullable(responseStorage.get(id));
	}

	public List<SurveyResponse> findAllByRedspondentId(String respondentId) {
		return responseStorage.values().stream().filter(r -> r.getRespondentId().equals(respondentId)).toList();
	}

	public List<SurveyResponse> getAll() {
		return new ArrayList<>(responseStorage.values());
	}
}

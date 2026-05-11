package com.survey.universe.service.stub;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.stub.provider.StubSurveyResponsesProvider;
import com.survey.universe.domain.stub.storage.StubSurveyResponseStorage;
import com.survey.universe.service.SurveyResponseService;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyResponseService implements SurveyResponseService {

	private final StubSurveyResponseStorage responseStorage;
	
	private final StubSurveyResponsesProvider provider;
	
	@PostConstruct
	private void init() {
		for (SurveyResponse response : provider.getAll()) {
			add(response);
		}
	}
	
	@Override
	public Optional<SurveyResponse> add(SurveyResponse response) {
		response.setRevision("1-stub");
		responseStorage.add(response);
		response.setSubmittedAt(Instant.now());
		return Optional.of(response);
	}

	@Override
	public List<SurveyResponse> findAllBySurveyId(String surveyId) {
		return responseStorage.findAllBySurveyId(surveyId);
	}

	@Override
	public Optional<SurveyResponse> findByResponseId(String id) {
		return responseStorage.findByResponseId(id);
	}

	@Override
	public List<SurveyResponse> findAllByRespondentId(String respondentId) {
		return responseStorage.findAllByRedspondentId(respondentId);
	}

}

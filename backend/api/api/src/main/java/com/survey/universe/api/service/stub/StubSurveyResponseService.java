package com.survey.universe.api.service.stub;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.persistence.entity.SurveyResponse;
import com.survey.universe.api.persistence.stub.StubSurveyResponseStorage;
import com.survey.universe.api.service.SurveyResponseService;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubSurveyResponseService implements SurveyResponseService {

	private StubSurveyResponseStorage responseStorage;
	
	@Override
	public Optional<SurveyResponse> add(SurveyResponse surveyResponse) {
		surveyResponse.setRevision("1-stub");
		responseStorage.add(surveyResponse);
		
		return Optional.of(surveyResponse);
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

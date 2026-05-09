package com.survey.universe.api.service;

import java.util.List;
import java.util.Optional;

import com.survey.universe.api.persistence.entity.SurveyResponse;

public interface SurveyResponseService {

	public Optional<SurveyResponse> add(SurveyResponse surveyResponse);

	public List<SurveyResponse> findAllBySurveyId(String surveyId);

	public Optional<SurveyResponse> findByResponseId(String id);

	public List<SurveyResponse> findAllByRespondentId(String respondentId);
}

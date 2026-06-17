package com.survey.universe.service;

import java.util.List;
import java.util.Optional;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.service.constant.TimeRange;

public interface SurveyService {

	public Optional<Survey> findById(String id);

	public List<Survey> findAllByCreator(String creatorId);

	public List<Survey> findActiveByCreator(String creatorId);

	public Optional<Survey> add(Survey survey);

	public Optional<Survey> update(Survey survey);

	public List<Survey> getAll();

	public List<Survey> findAllActive();

	public List<Survey> findAllHome();

	public List<Survey> findByStatus(SurveyStatus status);
	
	public Optional<Survey> findBySlugId(String slugId);

	public List<Survey> filter(List<SurveyStatus> allowedStatuses, SurveyType surveyType, SurveyStatus status,
			String creator, String search, String category, Boolean showDeleted, TimeRange timeRange);

}

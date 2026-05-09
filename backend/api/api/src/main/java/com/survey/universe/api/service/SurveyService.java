package com.survey.universe.api.service;

import java.util.List;
import java.util.Optional;

import com.survey.universe.api.persistence.entity.survey.Survey;

public interface SurveyService {
		
	public Optional<Survey> findById(String id);
	
	public List<Survey> findAllByCreator(String creatorId);
	
	public List<Survey> findActiveByCreator(String creatorId);
	
	public Optional<Survey> add(Survey survey);
	
	public Optional<Survey> update(Survey survey);
	
	public List<Survey> findAllActive();
	
	public List<Survey> findAllHome();
	
	public List<Survey> findByStatus(String status);

}

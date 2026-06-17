package com.survey.universe.service;

import java.util.List;
import java.util.Optional;

import com.survey.universe.domain.model.UserResponseStatsSnapshot;

public interface SurveyResponseSnapshotService {

	public Optional<UserResponseStatsSnapshot> add(UserResponseStatsSnapshot snapshot);
	
	public Optional<UserResponseStatsSnapshot> findByResponse(String responseId);
	
	public UserResponseStatsSnapshot delete(UserResponseStatsSnapshot snapshot);

	public List<UserResponseStatsSnapshot> findByUser(String userId);
	
	public List<UserResponseStatsSnapshot> findBySurvey(String surveyId);
	
}

package com.survey.universe.service;

import java.util.List;

import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.inheritable.ConditionalResponseDto;
import com.survey.universe.web.dto.request.SurveyResponseSubmitDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

public interface SurveyResponseFacadeService {

	public ConditionalResponseDto submitResponse(String urlId, SurveyResponseSubmitDto submitDto);

	public List<UserSurveyResponseDto> getResponses(String urlId);

	public SurveyStatsDto getSurveyStats(String urlId);

	public PersonalSurveyResponseDto getUserResponse(String surveyUrlId, String userUrlId);
	
	public List<SurveyStatsDto> filterSurveyStats(String category, TimeRange timeRange);
}

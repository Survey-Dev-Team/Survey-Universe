package com.survey.universe.service;

import java.util.List;

import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.SurveySubmitDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

public interface SurveyResponseFacadeService {

	public PersonalSurveyResponseDto submitResponse(String urlId, SurveySubmitDto submitDto);

	public List<UserSurveyResponseDto> getResponses(String urlId);

	public SurveyStatsDto getSurveyStats(String urlId);

	public PersonalSurveyResponseDto getUserResponse(String surveyUrlId, String userUrlId);
}

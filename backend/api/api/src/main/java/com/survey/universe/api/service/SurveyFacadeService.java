package com.survey.universe.api.service;


import java.util.List;

import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyStatsDto;
import com.survey.universe.api.web.dto.SurveySummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyResponseDto;

import jakarta.validation.Valid;

public interface SurveyFacadeService {

	public SurveyResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto);

	public SurveyResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto);

	public MessageDto deleteSurvey(String urlId);

	public List<SurveySummaryDto> getAllSurveys();

	public SurveyResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveySummaryDto> getFilteredSurveys(int page, int size, String category, String status, String search, String creator);

	public MessageDto submitResponse(String urlId, @Valid SurveySubmitDto submitDto);

	public List<UserSurveyResponseDto> getResponses(String urlId);

	public SurveyStatsDto getSurveyStats(String urlId);	

}

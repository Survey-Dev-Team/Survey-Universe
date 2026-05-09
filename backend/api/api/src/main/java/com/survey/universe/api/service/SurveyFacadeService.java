package com.survey.universe.api.service;

import java.util.List;

import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyStatsDto;
import com.survey.universe.api.web.dto.SurveySummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyResponseDto;

public interface SurveyFacadeService {

	public SurveyResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveySummaryDto> getFilteredSurveys(String category, String search, String creator,
			SortOption sortBy, TimeRange timeRange, int page, int size);

	public MessageDto submitResponse(String urlId, SurveySubmitDto submitDto);

	public List<UserSurveyResponseDto> getResponses(String urlId);

	public SurveyStatsDto getSurveyStats(String urlId);
}

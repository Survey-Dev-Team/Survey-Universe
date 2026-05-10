package com.survey.universe.service;


import com.survey.universe.service.constant.SortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.response.PagedResponseDto;
import com.survey.universe.web.dto.response.SurveyReadResponseDto;

public interface SurveyReadFacadeService {

	public SurveyReadResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveyReadSummaryDto> getFilteredSurveys(String category, String search, String creator,
			SortOption sortBy, TimeRange timeRange, int page, int size);

}

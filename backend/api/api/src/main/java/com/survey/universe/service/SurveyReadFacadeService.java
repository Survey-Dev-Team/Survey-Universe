package com.survey.universe.service;

import java.util.List;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyReadResponseDto;

public interface SurveyReadFacadeService {

	public SurveyReadResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveyReadSummaryDto> getFilteredSurveys(SurveyStatus surveyStatus, SurveyType surveyType,
			String category, String search, String creator, SurveySortOption sortBy, TimeRange timeRange, int page,
			int size);

	public List<SurveyReadSummaryDto> getHomeSurveys();

}

package com.survey.universe.service;

import com.survey.universe.service.constant.SortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.web.dto.response.PagedResponseDto;
import com.survey.universe.web.dto.response.SurveyDetailsResponseDto;

public interface SurveyDetailsFacadeService {

	public SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto);

	public SurveyDetailsResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto);
	
	public MessageDto deleteSurvey(String urlId);

	public SurveyDetailsResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(String status, String creator, String search,
			String category, SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size);
	
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(String status, String search,
			String category, SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size);


}

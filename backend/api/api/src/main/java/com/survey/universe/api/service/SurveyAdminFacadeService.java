package com.survey.universe.api.service;

import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyAdminSummaryDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyAdminResponseDto;

public interface SurveyAdminFacadeService {

	public SurveyAdminResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto);

	public SurveyAdminResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto);
	
	public MessageDto deleteSurvey(String urlId);

	public SurveyAdminResponseDto getAdminSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveyAdminSummaryDto> getAdminFilteredSurveys(String status, String creator, String search,
			String category, SortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size);

}

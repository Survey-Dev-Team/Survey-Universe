package com.survey.universe.service;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.auth.request.SurveyHomePatchDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.generic.RevisionMessageDto;
import com.survey.universe.web.dto.generic.RevisionRecordDto;
import com.survey.universe.web.dto.request.survey.AdminSurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyDetailsResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyUpdateRequestDto;

public interface SurveyDetailsFacadeService {

	public SurveyDetailsResponseDto createSurvey(SurveyCreateRequestDto surveyCreateDto);

	public SurveyDetailsResponseDto updateSurvey(String urlId, SurveyUpdateRequestDto surveyUpdateDto);
	
	public MessageDto deleteSurvey(String urlId);

	public SurveyDetailsResponseDto getSurveyByUrlId(String urlId);

	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status, String creator, String search,
			String category, SurveySortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size);
	
	public PagedResponseDto<SurveyDetailsSummaryDto> getFilteredSurveys(SurveyType surveyType, SurveyStatus status, String search,
			String category, SurveySortOption sortBy, TimeRange timeRange, Boolean showDeleted, int page, int size);

	public RevisionMessageDto publishSurvey(String urlId, RevisionRecordDto revision);

	public RevisionMessageDto closeSurvey(String urlId, RevisionRecordDto revision);

	public RevisionMessageDto draftSurvey(String urlId, RevisionRecordDto revision);

	public RevisionMessageDto setHome(String urlId, SurveyHomePatchDto revision);

	public SurveyDetailsResponseDto createSurvey(AdminSurveyCreateRequestDto surveyCreateDto);

}

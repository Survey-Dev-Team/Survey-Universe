package com.survey.universe.web.dto.aggregation;

import java.util.List;

public record ActiveAssessmentsDashboardDto(
	    List<ActiveSurveyCardDto> surveys,
	    List<ActiveTestCardDto> tests
	) {}


	


package com.survey.universe.web.dto.request.survey;

import com.survey.universe.domain.constant.SurveyStatus;

import jakarta.validation.constraints.NotNull;

public record AdminSurveyCreateRequestDto(SurveyCreateRequestDto surveyData, @NotNull SurveyStatus status) {

}

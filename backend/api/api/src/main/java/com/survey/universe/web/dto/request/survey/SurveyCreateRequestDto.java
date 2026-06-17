package com.survey.universe.web.dto.request.survey;

import java.util.List;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.model.survey.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SurveyCreateRequestDto(@NotBlank String title, String description, @NotEmpty List<String> category,
		Integer estimatedTime, String icon, @Valid @NotEmpty List<Question> questions, Integer passThreshold,
		String type, SurveyStatus status) {
}

package com.survey.universe.web.dto.request;

import java.util.List;

import com.survey.universe.domain.model.survey.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SurveyCreateRequestDto(@NotBlank String title, String description, @NotEmpty List<String> category,
		Integer estimatedTime, String icon, Boolean isHome, @Valid @NotEmpty List<Question> questions) {
}

package com.survey.universe.api.web.dto.request;

import java.util.List;

import com.survey.universe.api.persistence.entity.survey.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SurveyCreateRequestDto(@NotBlank String title, String description, @NotEmpty List<String> category,
		Integer estimatedTime, String icon, Boolean isHome, @Valid @NotEmpty List<Question> questions) {
}

package com.survey.universe.web.dto.request.survey;

import java.util.List;

import com.survey.universe.domain.model.survey.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SurveyUpdateRequestDto(@NotBlank String revision, @NotBlank String title, String description,
		List<String> category, Integer estimatedTime, String icon, Boolean isHome, Integer passThreshold, String type,
		@Valid @NotEmpty List<Question> questions) {
}

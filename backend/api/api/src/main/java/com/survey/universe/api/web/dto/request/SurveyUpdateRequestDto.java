package com.survey.universe.api.web.dto.request;

import java.util.List;

import com.survey.universe.api.persistence.entity.survey.Question;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record SurveyUpdateRequestDto(@NotBlank String revision, @NotBlank String title, String description,
		List<String> category, Integer estimatedTime, String status, String icon, Boolean isHome,
		@Valid @NotEmpty List<Question> questions) {
}

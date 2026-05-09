package com.survey.universe.api.web.dto.response;

import java.time.Instant;
import java.util.List;

import com.survey.universe.api.persistence.entity.survey.Question;

public record SurveyResponseDto(String id, String urlId, String revision, String title, String description, String icon, List<String> category,
		Integer estimatedTime, List<Question> questions, Instant createdAt) {
	
}

package com.survey.universe.api.web.dto;

import java.util.List;

public record SurveyStatsDto(String surveyUrlId, String title, long totalResponses,
		List<QuestionStatsDto> questionStats) {
}
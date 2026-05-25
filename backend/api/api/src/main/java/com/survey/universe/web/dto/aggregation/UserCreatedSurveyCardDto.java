package com.survey.universe.web.dto.aggregation;

public record UserCreatedSurveyCardDto(String urlId, String title, String category, String formattedDate,
		long totalRespondents, double avgMetrics) {
}

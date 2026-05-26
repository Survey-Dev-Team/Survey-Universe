package com.survey.universe.web.dto.aggregation;

public record UserCreatedSurveyCardDto(String urlId, String icon, String title, String category, String formattedDate,
		long totalRespondents, double avgMetrics) {
}

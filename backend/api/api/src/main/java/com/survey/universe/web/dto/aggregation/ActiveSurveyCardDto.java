package com.survey.universe.web.dto.aggregation;

public record ActiveSurveyCardDto(String urlId, String title, String category, String formattedDate, long respondents,
		double avgCompletionRate) {
}
package com.survey.universe.web.dto.aggregation;

public record ActiveSurveyCardDto(String urlId, String icon, String title, String category, String formattedDate, long respondents,
		double avgCompletionRate) {
}
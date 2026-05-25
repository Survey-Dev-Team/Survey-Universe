package com.survey.universe.web.dto.aggregation;

public record ActiveTestCardDto(String urlId, String title, String category, String formattedDate, long respondents,
		double avgScore) {
}
package com.survey.universe.web.dto.aggregation;

public record UserCompletedTestCardDto(String urlId, String title, String category, String formattedDate,
		double userResult, String passStatus) {
}

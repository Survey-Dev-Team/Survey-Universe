package com.survey.universe.web.dto.aggregation;

public record UserCompletedTestCardDto(String urlId, String icon, String title, String category, String formattedDate,
		double userResult, String passStatus) {
}

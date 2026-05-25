package com.survey.universe.web.dto.aggregation;

public record UserTestReportDto(String id, String title, String category, int score, String status,
		String completedOn) {
}

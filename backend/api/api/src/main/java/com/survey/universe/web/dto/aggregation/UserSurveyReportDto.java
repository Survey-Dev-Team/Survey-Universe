package com.survey.universe.web.dto.aggregation;

public record UserSurveyReportDto(String id, String title, String category, int completionPercentage,
		String completedOn) {
}
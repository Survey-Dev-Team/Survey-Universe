package com.survey.universe.web.dto.aggregation;

public record ActiveAssessmentCardDto(String urlId, String icon, String title, String type, String category, long totalRespondents,
		long completedCount, double displayMetric, String lastActivity, String status) {
}

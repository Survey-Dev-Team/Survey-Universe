package com.survey.universe.web.dto.aggregation;

public record TestSummaryDto(String id, String title, String category, long participants, int avgScore, int passRate,
		long avgTimeInMinutes, String status) {
}

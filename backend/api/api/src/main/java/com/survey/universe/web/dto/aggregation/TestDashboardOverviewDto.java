package com.survey.universe.web.dto.aggregation;

public record TestDashboardOverviewDto(long totalParticipants, long totalItems, long activeItems, double avgCompletion, double avgScore, double avgPassRate, double avgTime) {

}
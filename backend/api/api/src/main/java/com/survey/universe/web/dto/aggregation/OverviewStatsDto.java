package com.survey.universe.web.dto.aggregation;

public record OverviewStatsDto(long totalParticipants, long totalSurveys, long activeSurveys, double avgCompletion) {
}
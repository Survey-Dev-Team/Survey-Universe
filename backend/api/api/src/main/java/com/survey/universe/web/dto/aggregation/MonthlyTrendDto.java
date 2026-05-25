package com.survey.universe.web.dto.aggregation;

public record MonthlyTrendDto(String month, double avgScore, double passRate) {
}
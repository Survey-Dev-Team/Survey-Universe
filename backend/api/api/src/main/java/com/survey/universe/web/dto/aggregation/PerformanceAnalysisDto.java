package com.survey.universe.web.dto.aggregation;

import java.util.List;

public record PerformanceAnalysisDto(List<MonthlyTrendDto> monthlyTrends, ScoreDistributionDto scoreDistribution) {
}
package com.survey.universe.web.dto.aggregation;

import java.util.Map;

public record ActivityMetricsDto(Map<String, Long> participantsByMonth, Map<String, Long> surveysByCategory) {

}
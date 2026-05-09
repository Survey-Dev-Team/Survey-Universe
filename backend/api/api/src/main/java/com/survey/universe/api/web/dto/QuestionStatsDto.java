package com.survey.universe.api.web.dto;

import java.util.List;
import java.util.Map;

public record QuestionStatsDto(String questionId, String label, String type, Map<String, Long> answerCounts,
		Double averageValue, List<String> textSamples) {

}

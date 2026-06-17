package com.survey.universe.web.dto;

import java.util.List;
import java.util.Map;

import com.survey.universe.domain.constant.QuestionType;

public record QuestionStatsDto(String questionId, String label, QuestionType type, Map<String, Long> answerCounts,
		Double averageValue, List<String> textSamples) {

}

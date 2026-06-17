package com.survey.universe.web.dto;

import java.util.List;

public record SurveyStatsDto(String surveyUrlId, String title, long totalResponses, long completeResponses, Long passedResponses, Integer questionsTotal,
		Integer markedQuestionsTotal, Integer nonContentQuestionsTotal, Double averageAnsweredTotal,
		Double averageMarkedAnswerTotal, List<QuestionStatsDto> questionStats) {

}
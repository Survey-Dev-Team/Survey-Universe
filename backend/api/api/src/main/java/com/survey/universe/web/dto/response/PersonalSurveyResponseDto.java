package com.survey.universe.web.dto.response;

import java.time.Instant;
import java.util.List;

import com.survey.universe.web.dto.question.PersonalRespondentAnswerDto;

public record PersonalSurveyResponseDto(String userId, String surveyUrlId, Integer questionsTotal,
		Integer nonContentQuestionsTotal, Integer markedQuestionsTotal, Integer questionsAnswered,
		Integer markedQuestionsAnswered, Integer correctAnswerCount, Instant sumbittedAt,
		List<PersonalRespondentAnswerDto> respondentAswers) {

}

package com.survey.universe.web.dto;

import java.time.Instant;
import java.util.List;

import com.survey.universe.domain.model.ResponseAnswer;

public record UserSurveyResponseDto(String responseId, String surveyUrlId, String userUrlId, String title,
		Instant submittedAt, List<ResponseAnswer> answers) {

}

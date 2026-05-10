package com.survey.universe.web.dto.question;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record PersonalRespondentAnswerDto(String questionId, List<String> selectedOptions, List<String> correctOptions,
		String selectedValue, String correctValue, Boolean isCorrect) {
}

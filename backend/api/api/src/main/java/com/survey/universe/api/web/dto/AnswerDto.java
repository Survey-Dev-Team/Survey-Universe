package com.survey.universe.api.web.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record AnswerDto(@NotBlank String questionId, String value, List<String> options) {

}

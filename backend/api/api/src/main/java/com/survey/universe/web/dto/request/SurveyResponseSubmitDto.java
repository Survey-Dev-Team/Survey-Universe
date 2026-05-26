package com.survey.universe.web.dto.request;

import java.util.List;

import com.survey.universe.web.dto.AnswerDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record SurveyResponseSubmitDto(@Valid @NotEmpty List<AnswerDto> answers, @NotNull Boolean isComplete) {

}

package com.survey.universe.web.dto.request;

import java.util.List;

import com.survey.universe.web.dto.AnswerDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record SurveySubmitDto(@Valid @NotEmpty List<AnswerDto> answers) {

}

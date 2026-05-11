package com.survey.universe.web.dto.question.details;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SelectionQuestionDetailsDto extends QuestionDetailsDto {

	@Valid
	@JsonProperty("options")
	private List<OptionDetailsDto> options = new ArrayList<>();
}

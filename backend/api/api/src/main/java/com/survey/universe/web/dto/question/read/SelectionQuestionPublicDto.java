package com.survey.universe.web.dto.question.read;

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
public class SelectionQuestionPublicDto extends QuestionPublicDto {

	@Valid
	@JsonProperty("options")
	private List<OptionPublicDto> options = new ArrayList<>();
}

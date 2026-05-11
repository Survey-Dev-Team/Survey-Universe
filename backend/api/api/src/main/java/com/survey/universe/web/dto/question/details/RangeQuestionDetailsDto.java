package com.survey.universe.web.dto.question.details;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RangeQuestionDetailsDto extends QuestionDetailsDto {

	@JsonProperty("min")
	private Integer min;

	@JsonProperty("max")
	private Integer max;

	@JsonProperty("step")
	private Integer step;
	
	@JsonProperty("correct_answer")
	private Integer correctAnswer;
}

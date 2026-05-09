package com.survey.universe.api.persistence.entity.survey;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RangeQuestion extends Question {

	@JsonProperty("min")
	private Integer min;

	@JsonProperty("max")
	private Integer max;

	@JsonProperty("step")
	private Integer step;
	
	@JsonProperty("correct_answer")
	private String correctAnswer;
}

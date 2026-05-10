package com.survey.universe.domain.model.survey;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;

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
	private Integer correctAnswer;
	
	public <T> T accept(QuestionVisitor<T> visitor) {
		return visitor.visit(this);
	}
}

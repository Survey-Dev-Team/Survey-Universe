package com.survey.universe.api.persistence.entity.survey;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class TextAreaQuestion extends OpenFormQuestion {

	@JsonProperty("correct_answer")
	private String correctAnswer;
}

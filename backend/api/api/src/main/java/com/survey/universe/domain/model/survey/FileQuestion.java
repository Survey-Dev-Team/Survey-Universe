package com.survey.universe.domain.model.survey;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FileQuestion extends OpenFormQuestion {


	@JsonProperty("link")
	private String link;
	
	public <T> T accept(QuestionVisitor<T> visitor) {
		return visitor.visit(this);
	}
}

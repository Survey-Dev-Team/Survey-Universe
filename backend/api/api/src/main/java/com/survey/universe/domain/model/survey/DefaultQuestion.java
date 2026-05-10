package com.survey.universe.domain.model.survey;

import com.survey.universe.domain.model.abstraction.QuestionVisitor;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DefaultQuestion extends Question {@Override
	
	public <T> T accept(QuestionVisitor<T> visitor) {
		return visitor.visit(this);
	}

}

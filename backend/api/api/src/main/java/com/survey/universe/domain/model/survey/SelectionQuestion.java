package com.survey.universe.domain.model.survey;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SelectionQuestion extends Question {

    @Valid 
    @JsonProperty("options")
    private List<Option> options = new ArrayList<>();
    
    public <T> T accept(QuestionVisitor<T> visitor) {
		return visitor.visit(this);
	}
}

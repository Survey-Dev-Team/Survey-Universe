package com.survey.universe.mapper;

import com.survey.universe.domain.model.abstraction.QuestionVisitor;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.web.dto.question.QuestionDto;

public abstract class QuestionToDtoMapper<T> implements QuestionVisitor<T> {

	protected void copyBaseFields(Question question, QuestionDto dto) {
		dto.setId(question.getId());
		dto.setLabel(question.getLabel());
		dto.setSortOrder(question.getSortOrder());
		dto.setType(question.getType());
		dto.setIsRequired(question.getIsRequired());
	}
}

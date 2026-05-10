package com.survey.universe.mapper;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.abstraction.QuestionVisitor;
import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;
import com.survey.universe.web.dto.question.DefaultQuestionPublicDto;
import com.survey.universe.web.dto.question.FileQuestionPublicDto;
import com.survey.universe.web.dto.question.InputQuestionPublicDto;
import com.survey.universe.web.dto.question.OpenFormQuestionPublicDto;
import com.survey.universe.web.dto.question.OptionPublicDto;
import com.survey.universe.web.dto.question.QuestionPublicDto;
import com.survey.universe.web.dto.question.RangeQuestionPublicDto;
import com.survey.universe.web.dto.question.SelectionQuestionPublicDto;
import com.survey.universe.web.dto.question.SimpleRespondedQuestionPublicDto;
import com.survey.universe.web.dto.question.TextAreaQuestionPublicDto;

@Component
public class QuestionToDtoMapper implements QuestionVisitor<QuestionPublicDto> {

	private void copyBaseFields(Question question, QuestionPublicDto dto) {
		dto.setId(question.getId());
		dto.setLabel(question.getLabel());
		dto.setSortOrder(question.getSortOrder());
		dto.setType(question.getType());
		dto.setIsRequired(question.getIsRequired());
	}

	@Override
	public QuestionPublicDto visit(RangeQuestion question) {
		RangeQuestionPublicDto dto = new RangeQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setMin(question.getMin());
		dto.setMax(question.getMax());
		dto.setStep(question.getStep());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(SelectionQuestion question) {
		SelectionQuestionPublicDto dto = new SelectionQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setOptions(question.getOptions().stream()
				.map(o -> new OptionPublicDto(o.getId(), o.getLabel(), o.getSortOrder())).toList());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(TextAreaQuestion question) {
		TextAreaQuestionPublicDto dto = new TextAreaQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(InputQuestion question) {
		InputQuestionPublicDto dto = new InputQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		dto.setInputType(question.getInputType());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(FileQuestion question) {
		FileQuestionPublicDto dto = new FileQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		dto.setLink(question.getLink());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(OpenFormQuestion question) {
		OpenFormQuestionPublicDto dto = new OpenFormQuestionPublicDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		return dto;
	}

	@Override
	public QuestionPublicDto visit(SimpleRespondedQuestion question) {
		SimpleRespondedQuestionPublicDto dto = new SimpleRespondedQuestionPublicDto();
		copyBaseFields(question, dto);
		return dto;
	}

	@Override
	public QuestionPublicDto visit(DefaultQuestion question) {
		DefaultQuestionPublicDto dto = new DefaultQuestionPublicDto();
		copyBaseFields(question, dto);
		return dto;
	}

}

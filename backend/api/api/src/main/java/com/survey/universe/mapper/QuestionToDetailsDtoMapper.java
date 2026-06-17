package com.survey.universe.mapper;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;
import com.survey.universe.web.dto.question.details.DefaultQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.FileQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.InputQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.OpenFormQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.OptionDetailsDto;
import com.survey.universe.web.dto.question.details.QuestionDetailsDto;
import com.survey.universe.web.dto.question.details.RangeQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.SelectionQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.SimpleRespondedQuestionDetailsDto;
import com.survey.universe.web.dto.question.details.TextAreaQuestionDetailsDto;

@Component
public class QuestionToDetailsDtoMapper extends QuestionToDtoMapper<QuestionDetailsDto> {

	@Override
	public QuestionDetailsDto visit(RangeQuestion question) {
		RangeQuestionDetailsDto dto = new RangeQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setMin(question.getMin());
		dto.setMax(question.getMax());
		dto.setStep(question.getStep());
		dto.setCorrectAnswer(question.getCorrectAnswer());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(SelectionQuestion question) {
		SelectionQuestionDetailsDto dto = new SelectionQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setOptions(question.getOptions().stream()
				.map(o -> new OptionDetailsDto(o.getId(), o.getLabel(), o.getSortOrder(), o.getCorrect())).toList());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(TextAreaQuestion question) {
		TextAreaQuestionDetailsDto dto = new TextAreaQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		dto.setCorrectAnswer(question.getCorrectAnswer());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(InputQuestion question) {
		InputQuestionDetailsDto dto = new InputQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		dto.setInputType(question.getInputType());
		dto.setCorrectAnswer(question.getCorrectAnswer());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(FileQuestion question) {
		FileQuestionDetailsDto dto = new FileQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		dto.setLink(question.getLink());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(OpenFormQuestion question) {
		OpenFormQuestionDetailsDto dto = new OpenFormQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setPlaceholder(question.getPlaceholder());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(SimpleRespondedQuestion question) {
		SimpleRespondedQuestionDetailsDto dto = new SimpleRespondedQuestionDetailsDto();
		copyBaseFields(question, dto);
		dto.setCorrectAnswer(question.getCorrectAnswer());
		return dto;
	}

	@Override
	public QuestionDetailsDto visit(DefaultQuestion question) {
		DefaultQuestionDetailsDto dto = new DefaultQuestionDetailsDto();
		copyBaseFields(question, dto);
		return dto;
	}

}

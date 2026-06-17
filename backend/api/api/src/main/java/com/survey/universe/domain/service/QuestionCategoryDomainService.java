package com.survey.universe.domain.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;
import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;

@Service
public class QuestionCategoryDomainService implements QuestionVisitor<QuestionCategory> {

	@Override
	public QuestionCategory visit(RangeQuestion question) {
		return question.getCorrectAnswer() != null ? QuestionCategory.MARKED : QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(SelectionQuestion question) {
		return question.getOptions().get(0).getCorrect() != null ? QuestionCategory.MARKED : QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(TextAreaQuestion question) {
		return StringUtils.hasText(question.getCorrectAnswer()) ? QuestionCategory.MARKED : QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(InputQuestion question) {
		return StringUtils.hasText(question.getCorrectAnswer()) ? QuestionCategory.MARKED : QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(FileQuestion question) {
		return QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(OpenFormQuestion question) {
		return QuestionCategory.CONTENT_ONLY;
	}

	@Override
	public QuestionCategory visit(SimpleRespondedQuestion question) {
		return StringUtils.hasText(question.getCorrectAnswer()) ? QuestionCategory.MARKED : QuestionCategory.UNMARKED;
	}

	@Override
	public QuestionCategory visit(DefaultQuestion question) {
		return QuestionCategory.CONTENT_ONLY;
	}

}

package com.survey.universe.mapper;

import java.util.HashSet;
import java.util.List;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.ResponseAnswer;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;
import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;
import com.survey.universe.web.dto.question.PersonalRespondentAnswerDto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class QuestionToPersonalResponseMapper implements QuestionVisitor<PersonalRespondentAnswerDto> {

	private ResponseAnswer answer;

	private PersonalRespondentAnswerDto toUnmarkedDto(ResponseAnswer answer) {
		return new PersonalRespondentAnswerDto(answer.getId(), answer.getSelectedOptions(), null, answer.getValue(),
				null, null);
	}

	private PersonalRespondentAnswerDto toValueMarkedDto(String id, String answer, String correct) {
		return new PersonalRespondentAnswerDto(id, null, null, answer, correct, answer.equals(correct));
	}

	private PersonalRespondentAnswerDto toOptionMarkedDto(String id, List<String> answer, List<String> correct) {
		return new PersonalRespondentAnswerDto(id, answer, correct, null, null,
				new HashSet<>(answer).equals(new HashSet<>(correct)));
	}

	@Override
	public PersonalRespondentAnswerDto visit(RangeQuestion question) {
		return question.getQuestionCategory().equals(QuestionCategory.UNMARKED) ? toUnmarkedDto(answer)
				: toValueMarkedDto(answer.getId(), answer.getValue(), question.getCorrectAnswer().toString());
	}

	@Override
	public PersonalRespondentAnswerDto visit(SelectionQuestion question) {
		return question.getQuestionCategory().equals(QuestionCategory.UNMARKED) ? toUnmarkedDto(answer)
				: toOptionMarkedDto(answer.getId(), answer.getSelectedOptions(),
						question.getOptions().stream().filter(o -> o.getCorrect()).map(o -> o.getId()).toList());
	}

	@Override
	public PersonalRespondentAnswerDto visit(TextAreaQuestion question) {
		return question.getQuestionCategory().equals(QuestionCategory.UNMARKED) ? toUnmarkedDto(answer)
				: toValueMarkedDto(answer.getId(), answer.getValue(), question.getCorrectAnswer());
	}

	@Override
	public PersonalRespondentAnswerDto visit(InputQuestion question) {
		return question.getQuestionCategory().equals(QuestionCategory.UNMARKED) ? toUnmarkedDto(answer)
				: toValueMarkedDto(answer.getId(), answer.getValue(), question.getCorrectAnswer());
	}

	@Override
	public PersonalRespondentAnswerDto visit(FileQuestion question) {
		return toUnmarkedDto(answer);
	}

	@Override
	public PersonalRespondentAnswerDto visit(OpenFormQuestion question) {
		return null;
	}

	@Override
	public PersonalRespondentAnswerDto visit(SimpleRespondedQuestion question) {
		return question.getQuestionCategory().equals(QuestionCategory.UNMARKED) ? toUnmarkedDto(answer)
				: toValueMarkedDto(answer.getId(), answer.getValue(), question.getCorrectAnswer());
	}

	@Override
	public PersonalRespondentAnswerDto visit(DefaultQuestion question) {
		return null;
	}

}

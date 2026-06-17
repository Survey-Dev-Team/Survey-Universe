package com.survey.universe.domain.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.survey.Option;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.exception.type.ForbiddenException;

import lombok.AllArgsConstructor;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;

@Service
@AllArgsConstructor
public class SurveyDomainService {

	private QuestionCategoryDomainService questionCategories;

	public void normalizeQuestionIds(List<Question> questions) {
		if (questions == null) {
			return;
		}

		for (int i = 0; i < questions.size(); i++) {
			Question q = questions.get(i);
			q.setId("q" + (i + 1));
			q.setSortOrder(i + 1);
			if (q instanceof SelectionQuestion sq) {
				for (int j = 0; j < sq.getOptions().size(); j++) {
					Option opt = sq.getOptions().get(j);
					opt.setId("opt" + (j + 1));
					opt.setSortOrder(j + 1);
				}
			}
		}
	}

	public void updateStatusInstant(Survey survey, SurveyStatus newStatus) {
		if (survey.getStatus() == newStatus) {
			return;
		}
		switch (newStatus) {
		case PUBLISHED -> survey.setPublishedAt(Instant.now());
		case CLOSED -> survey.setClosedAt(Instant.now());
		case DRAFT -> {
			return;
		}
		}
		survey.setStatus(newStatus);
	}

	public void validateOwnership(Survey survey, String userId) {
		if (!survey.getCreatorId().equals(userId)) {
			throw new ForbiddenException("You can only edit your own surveys");
		}
	}

	public void setSurveyType(Survey survey) {
		List<Question> questions = survey.getQuestions();
		questions.stream().forEach(q -> q.setQuestionCategory(q.accept(questionCategories)));
		if (questions.stream().filter(q -> q.getQuestionCategory().equals(QuestionCategory.MARKED)).toList()
				.size() >= 1) {
			survey.setSurveyType(SurveyType.TEST);
		} else if (questions.stream().filter(q -> q.getQuestionCategory().equals(QuestionCategory.CONTENT_ONLY))
				.toList().size() == questions.size()) {
			survey.setSurveyType(SurveyType.PRESENTATION);
		} else {
			survey.setSurveyType(SurveyType.QUESTIONNAIRE);
		}
	}
}

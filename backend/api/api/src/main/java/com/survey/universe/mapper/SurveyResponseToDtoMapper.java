package com.survey.universe.mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.ResponseAnswer;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.model.survey.TextAreaQuestion;
import com.survey.universe.web.dto.QuestionStatsDto;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.response.PersonalRespondentAnswerDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

@Component
public class SurveyResponseToDtoMapper {

	public QuestionStatsDto toQuestionStatsDto(Question question, List<SurveyResponse> responses) {
		List<ResponseAnswer> answers = responses.stream().flatMap(r -> r.getResponseAnswers().stream())
				.filter(a -> a.getId().equals(question.getId())).toList();

		Double average = null;
		List<String> samples = new ArrayList<>();
		Map<String, Long> counts = new HashMap<>();
		if (question instanceof SelectionQuestion) {
			answers.forEach(a -> a.getSelectedOptions().forEach(optId -> {
				counts.merge(optId, 1L, Long::sum);
			}));
		} else if (question instanceof RangeQuestion) {
			average = answers.stream().filter(a -> a.getValue() != null)
					.mapToDouble(a -> Double.parseDouble(a.getValue())).average().orElse(0.0);
		} else if (question instanceof TextAreaQuestion) {
			samples = answers.stream().map(ResponseAnswer::getValue).filter(Objects::nonNull).filter(v -> !v.isBlank())
					.limit(5).toList();
		}

		return new QuestionStatsDto(question.getId(), question.getLabel(), question.getType(), counts, average,
				samples);
	}

	public SurveyStatsDto toSurveyStatsDto(String urlId, Survey survey, List<SurveyResponse> responses) {
		List<QuestionStatsDto> stats = survey.getQuestions().stream()
				.filter(q -> !q.getQuestionCategory().equals(QuestionCategory.CONTENT_ONLY))
				.<QuestionStatsDto>map(q -> toQuestionStatsDto(q, responses)).toList();

		return new SurveyStatsDto(urlId, survey.getTitle(), responses.size(), stats);
	}

	public PersonalSurveyResponseDto toPersonalSurveyResponseDto(String surveyUrlId, Survey survey,
			SurveyResponse response) {
		List<Question> questions = survey.getQuestions();
		Map<String, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, q -> q));

		List<PersonalRespondentAnswerDto> answers = response.getResponseAnswers().stream()
				.flatMap(a -> Optional.ofNullable(questionsMap.get(a.getId()))
						.map(q -> q.accept(new QuestionToPersonalResponseMapper(a))).stream())
				.toList();

		List<PersonalRespondentAnswerDto> markedAnswers = answers.stream().filter(a -> a.isCorrect() != null).toList();

		return new PersonalSurveyResponseDto(response.getId(), surveyUrlId, questions.size(),
				questions.stream().filter(q -> !q.getQuestionCategory().equals(QuestionCategory.CONTENT_ONLY)).toList()
						.size(),
				questions.stream().filter(q -> q.getQuestionCategory().equals(QuestionCategory.MARKED)).toList().size(),
				answers.size(), markedAnswers.size(),
				markedAnswers.stream().filter(a -> Boolean.TRUE.equals(a.isCorrect())).toList().size(),
				response.getSubmittedAt(), answers);
	}
}

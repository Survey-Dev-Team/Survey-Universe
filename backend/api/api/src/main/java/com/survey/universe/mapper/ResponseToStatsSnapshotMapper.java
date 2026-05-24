package com.survey.universe.mapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.UserResponseStatsSnapshot;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.web.dto.response.PersonalRespondentAnswerDto;

@Component
public class ResponseToStatsSnapshotMapper {

	public UserResponseStatsSnapshot toStatsSnapshots(SurveyResponse response, Survey survey, String userId,
			String id) {
		List<Question> questions = survey.getQuestions();
		Map<String, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, q -> q));

		List<PersonalRespondentAnswerDto> answers = response.getResponseAnswers().stream()
				.flatMap(a -> Optional.ofNullable(questionsMap.get(a.getId()))
						.map(q -> q.accept(new QuestionToPersonalResponseMapper(a))).stream())
				.toList();

		List<PersonalRespondentAnswerDto> markedAnswers = answers.stream().filter(a -> a.isCorrect() != null).toList();

		UserResponseStatsSnapshot snapshot = new UserResponseStatsSnapshot();
		snapshot.setId(id);
		snapshot.setUserId(userId);
		snapshot.setSurveyId(survey.getId());
		snapshot.setResponseId(response.getId());
		snapshot.setQuestionsTotal(questions.size());
		snapshot.setNonContentQuestionsTotal(questions.stream()
				.filter(q -> !q.getQuestionCategory().equals(QuestionCategory.CONTENT_ONLY)).toList().size());
		snapshot.setMarkedQuestionsAnswered(questions.stream()
				.filter(q -> q.getQuestionCategory().equals(QuestionCategory.MARKED)).toList().size());
		snapshot.setQuestionsAnswered(answers.size());
		snapshot.setMarkedQuestionsAnswered(markedAnswers.size());
		snapshot.setCorrectAnswerCount(
				markedAnswers.stream().filter(a -> Boolean.TRUE.equals(a.isCorrect())).toList().size());
		return snapshot;
	}

}

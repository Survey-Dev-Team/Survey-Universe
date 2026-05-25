package com.survey.universe.service.stub;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.mapper.QuestionToPersonalResponseMapper;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.web.dto.aggregation.UserReportDto;
import com.survey.universe.web.dto.aggregation.UserSurveyReportDto;
import com.survey.universe.web.dto.aggregation.UserTableSummaryDto;
import com.survey.universe.web.dto.aggregation.UserTestReportDto;
import com.survey.universe.web.dto.response.PersonalRespondentAnswerDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OverviewUsersStatsService {

	private final UserService userService;
	private final SurveyResponseService responseService;
	private final SurveyService surveyService;
	
	public List<UserTableSummaryDto> getUsersTableSummary() {
		List<User> allUsers = userService.getAll();

		return allUsers.stream().map(user -> {
			long surveysCount = surveyService.findAllByCreator(user.getId()).size();

			long testsCount = responseService.findAllByRespondentId(user.getId()).stream()
					.filter(r -> Boolean.TRUE.equals(r.getIsComplete())).count();

			return new UserTableSummaryDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
					user.getRole(), surveysCount, testsCount, user.getCreatedAt(), user.getLastSession());
		}).toList();
	}

	public UserReportDto getUserActivityReport(String respondentId) {
		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy").withZone(ZoneId.systemDefault());

		List<SurveyResponse> userResponses = responseService.findAllByRespondentId(respondentId);

		List<UserSurveyReportDto> surveyReports = userResponses.stream()
				.filter(r -> !Boolean.TRUE.equals(r.getIsComplete())).map(response -> {
					Survey survey = surveyService.findById(response.getSurveyId()).orElse(null);
					if (survey == null)
						return null;

					String categoryText = survey.getCategory().isEmpty() ? "—" : survey.getCategory().get(0);

					int totalQuestions = survey.getQuestions().size();
					int answeredQuestions = response.getResponseAnswers().size();
					int completion = totalQuestions > 0 ? (answeredQuestions * 100) / totalQuestions : 0;

					String dateStr = response.getSubmittedAt() != null ? dateFormatter.format(response.getSubmittedAt())
							: "—";

					return new UserSurveyReportDto(survey.getId(), survey.getTitle(), categoryText, completion,
							dateStr);
				}).filter(java.util.Objects::nonNull).toList();

		List<UserTestReportDto> testReports = userResponses.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete()))
				.map(response -> {
					Survey survey = surveyService.findById(response.getSurveyId()).orElse(null);
					if (survey == null)
						return null;

					String categoryText = survey.getCategory().isEmpty() ? "—" : survey.getCategory().get(0);

					double calculatedScore = evaluatePercentageScoreManually(response, survey);
					int finalScore = (int) Math.round(calculatedScore);

					int threshold = survey.getPassThreshold() != null ? survey.getPassThreshold() : 50;
					String status = finalScore >= threshold ? "Passed" : "Failed";

					String dateStr = response.getSubmittedAt() != null ? dateFormatter.format(response.getSubmittedAt())
							: "—";

					return new UserTestReportDto(survey.getId(), survey.getTitle(), categoryText, finalScore, status,
							dateStr);
				}).filter(java.util.Objects::nonNull).toList();

		return new UserReportDto(surveyReports, testReports);
	}
	
	private double evaluatePercentageScoreManually(SurveyResponse response, Survey survey) {
		List<Question> questions = survey.getQuestions();
		Map<String, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, q -> q));

		long markedQuestions = questions.stream().filter(q -> q.getQuestionCategory().equals(QuestionCategory.MARKED))
				.toList().size();

		List<PersonalRespondentAnswerDto> answers = response.getResponseAnswers().stream()
				.flatMap(a -> Optional.ofNullable(questionsMap.get(a.getId()))
						.map(q -> q.accept(new QuestionToPersonalResponseMapper(a))).stream())
				.toList();

		List<PersonalRespondentAnswerDto> markedAnswers = answers.stream().filter(a -> a.isCorrect() != null).toList();
		double score = markedAnswers.stream().filter(a -> Boolean.TRUE.equals(a.isCorrect())).toList().size();
		return ((double) score / markedQuestions) * 100;
	}

}

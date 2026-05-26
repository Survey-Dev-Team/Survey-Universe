package com.survey.universe.service.stub;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.exception.type.ResourceNotFoundException;
import com.survey.universe.mapper.QuestionToPersonalResponseMapper;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.spring.util.UserAuthContextUtil;
import com.survey.universe.web.dto.aggregation.ActiveAssessmentCardDto;
import com.survey.universe.web.dto.aggregation.ActiveAssessmentsDashboardDto;
import com.survey.universe.web.dto.aggregation.ActiveSurveyCardDto;
import com.survey.universe.web.dto.aggregation.ActiveTestCardDto;
import com.survey.universe.web.dto.aggregation.UserCompletedTestCardDto;
import com.survey.universe.web.dto.aggregation.UserCreatedSurveyCardDto;
import com.survey.universe.web.dto.response.PersonalRespondentAnswerDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserAggregationService {

	private SurveyService surveyService;
	private SurveyResponseService responseService;

	public ActiveAssessmentsDashboardDto getActiveAssessmentsForUsers() {
		List<Survey> activeSurveysAndTests = surveyService.findAllActive();
		List<SurveyResponse> allResponses = responseService.getAll();

		Map<String, List<SurveyResponse>> responsesBySurveyId = allResponses.stream().filter(Objects::nonNull)
				.collect(Collectors.groupingBy(SurveyResponse::getSurveyId));

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);

		List<ActiveSurveyCardDto> surveyCards = new ArrayList<>();
		List<ActiveTestCardDto> testCards = new ArrayList<>();

		for (Survey item : activeSurveysAndTests) {
			if (item == null || item.isDeleted())
				continue;

			List<SurveyResponse> itemResponses = responsesBySurveyId.getOrDefault(item.getId(),
					Collections.emptyList());
			long respondentCount = itemResponses.size();

			String categoryText = item.getCategory().isEmpty() ? "general" : item.getCategory().get(0);
			String formattedDate = item.getCreatedAt() != null
					? item.getCreatedAt().atZone(ZoneOffset.UTC).format(dateFormatter)
					: "—";

			if (item.getSurveyType() == SurveyType.QUESTIONNAIRE || item.getPassThreshold() == null) {

				double completionRate = 0.0;
				if (respondentCount > 0) {
					long completedCount = itemResponses.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete()))
							.count();
					completionRate = ((double) completedCount / respondentCount) * 100;
				}

				surveyCards.add(new ActiveSurveyCardDto(item.getSlugId(), item.getIcon(), item.getTitle(), categoryText,
						formattedDate, respondentCount, Math.round(completionRate * 10.0) / 10.0));

			} else {

				double totalScoreSum = 0.0;
				long completedCount = 0;

				for (SurveyResponse response : itemResponses) {
					if (Boolean.TRUE.equals(response.getIsComplete())) {
						totalScoreSum += evaluatePercentageScoreManually(response, item);
						completedCount++;
					}
				}

				double avgScore = completedCount > 0 ? (totalScoreSum / completedCount) : 0.0;

				testCards.add(new ActiveTestCardDto(item.getSlugId(), item.getIcon(), item.getTitle(), categoryText,
						formattedDate, respondentCount, Math.round(avgScore * 10.0) / 10.0));
			}
		}

		return new ActiveAssessmentsDashboardDto(surveyCards, testCards);
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

	public List<UserCompletedTestCardDto> getUserPersonalAssessments() {
		String currentUserId = UserAuthContextUtil.getCurrentUserId();

		List<Survey> allSurveys = surveyService.getAll();
		List<SurveyResponse> allResponses = responseService.getAll();

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);

		Map<String, Survey> surveyMap = allSurveys.stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(Survey::getId, s -> s, (s1, s2) -> s1));

		List<UserCompletedTestCardDto> completedAssessments = allResponses.stream()
				.filter(r -> r != null && currentUserId.equals(r.getRespondentId())).map(response -> {
					Survey survey = surveyMap.get(response.getSurveyId());
					if (survey == null || survey.isDeleted())
						return null;

					String categoryText = survey.getCategory().isEmpty() ? "general" : survey.getCategory().get(0);
					String formattedDate = response.getSubmittedAt() != null
							? response.getSubmittedAt().atZone(ZoneOffset.UTC).format(dateFormatter)
							: "—";

					double userResult = 0.0;
					String passStatus = "Survey";

					if (survey.getSurveyType() == SurveyType.QUESTIONNAIRE || survey.getPassThreshold() == null) {
						int totalQ = survey.getQuestions().size();
						int answeredQ = response.getResponseAnswers() != null ? response.getResponseAnswers().size()
								: 0;
						userResult = totalQ > 0 ? ((double) answeredQ / totalQ) * 100 : 0.0;
					} else {
						if (Boolean.TRUE.equals(response.getIsComplete())) {
							userResult = evaluatePercentageScoreManually(response, survey);
							int threshold = survey.getPassThreshold() != null ? survey.getPassThreshold() : 50;
							passStatus = userResult >= threshold ? "Passed" : "Failed";
						} else {
							passStatus = "Incomplete";
						}
					}

					return new UserCompletedTestCardDto(survey.getSlugId(), survey.getIcon(), survey.getTitle(),
							categoryText, formattedDate, Math.round(userResult * 10.0) / 10.0, passStatus);
				}).filter(Objects::nonNull).toList();

		return completedAssessments;
	}

	public List<UserCreatedSurveyCardDto> getCreatedSurveyAssessment() {
		String currentUserId = UserAuthContextUtil.getCurrentUserId();
		List<Survey> allSurveys = surveyService.getAll();
		List<SurveyResponse> allResponses = responseService.getAll();

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);

		Map<String, List<SurveyResponse>> responsesBySurveyId = allResponses.stream().filter(Objects::nonNull)
				.collect(Collectors.groupingBy(SurveyResponse::getSurveyId));

		List<UserCreatedSurveyCardDto> createdSurveys = allSurveys.stream()
				.filter(s -> s != null && !s.isDeleted() && currentUserId.equals(s.getCreatorId())).map(survey -> {
					List<SurveyResponse> surveyResponses = responsesBySurveyId.getOrDefault(survey.getId(),
							Collections.emptyList());
					long totalRespondents = surveyResponses.size();

					double calculatedMetric = 0.0;
					String categoryText = survey.getCategory().isEmpty() ? "general" : survey.getCategory().get(0);
					String formattedDate = survey.getCreatedAt() != null
							? survey.getCreatedAt().atZone(ZoneOffset.UTC).format(dateFormatter)
							: "—";

					if (survey.getSurveyType() == SurveyType.QUESTIONNAIRE || survey.getPassThreshold() == null) {
						if (totalRespondents > 0) {
							long completed = surveyResponses.stream()
									.filter(r -> Boolean.TRUE.equals(r.getIsComplete())).count();
							calculatedMetric = ((double) completed / totalRespondents) * 100;
						}
					} else {
						long completedCount = 0;
						double scoreSum = 0.0;
						for (SurveyResponse r : surveyResponses) {
							if (Boolean.TRUE.equals(r.getIsComplete())) {
								scoreSum += evaluatePercentageScoreManually(r, survey);
								completedCount++;
							}
						}
						calculatedMetric = completedCount > 0 ? (scoreSum / completedCount) : 0.0;
					}

					return new UserCreatedSurveyCardDto(survey.getSlugId(), survey.getIcon(), survey.getTitle(),
							categoryText, formattedDate, totalRespondents, Math.round(calculatedMetric * 10.0) / 10.0);
				}).toList();
		return createdSurveys;

	}

	public ActiveAssessmentCardDto getAssessmentDetail(String urlId) {
		Survey survey = surveyService.findBySlugId(urlId)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

		List<SurveyResponse> allResponsesForSurvey = responseService.findAllBySurveyId(survey.getId());

		long totalRespondents = allResponsesForSurvey.size();
		long completedCount = allResponsesForSurvey.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete()))
				.count();

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH);

		String lastActivityDate = allResponsesForSurvey.stream().filter(r -> r.getSubmittedAt() != null)
				.max(Comparator.comparing(SurveyResponse::getSubmittedAt))
				.map(r -> r.getSubmittedAt().atZone(ZoneOffset.UTC).format(dateFormatter))
				.orElse(survey.getCreatedAt() != null
						? survey.getCreatedAt().atZone(ZoneOffset.UTC).format(dateFormatter)
						: "—");

		String categoryText = survey.getCategory().isEmpty() ? "general" : survey.getCategory().get(0);
		String typeText = (survey.getSurveyType() == SurveyType.QUESTIONNAIRE || survey.getPassThreshold() == null)
				? "Survey"
				: "Test";

		double displayMetric = 0.0;

		if ("Survey".equals(typeText)) {
			if (totalRespondents > 0) {
				displayMetric = ((double) completedCount / totalRespondents) * 100;
			}
		} else {
			long completedResponsesCount = 0;
			double scoreSum = 0.0;

			for (SurveyResponse r : allResponsesForSurvey) {
				if (Boolean.TRUE.equals(r.getIsComplete())) {
					scoreSum += evaluatePercentageScoreManually(r, survey);
					completedResponsesCount++;
				}
			}
			displayMetric = completedResponsesCount > 0 ? (scoreSum / completedResponsesCount) : 0.0;
		}

		return new ActiveAssessmentCardDto(survey.getSlugId(), survey.getIcon(), survey.getTitle(), typeText,
				categoryText, totalRespondents, completedCount, Math.round(displayMetric * 10.0) / 10.0,
				lastActivityDate, survey.getStatus() != null ? survey.getStatus().name() : "UNKNOWN");
	}

}

package com.survey.universe.service.stub;

import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.mapper.QuestionToPersonalResponseMapper;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.web.dto.aggregation.MonthlyTrendDto;
import com.survey.universe.web.dto.aggregation.PerformanceAnalysisDto;
import com.survey.universe.web.dto.aggregation.ScoreDistributionDto;
import com.survey.universe.web.dto.aggregation.TestDashboardOverviewDto;
import com.survey.universe.web.dto.aggregation.TestSummaryDto;
import com.survey.universe.web.dto.generic.CompletionFunnelDto;
import com.survey.universe.web.dto.generic.FunnelStepDto;
import com.survey.universe.web.dto.response.PersonalRespondentAnswerDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OverviewTestsStatsService {

	private final SurveyResponseService responseService;
	private final SurveyService surveyService;

	private static final DateTimeFormatter CHART_MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);

	public CompletionFunnelDto getCompletionFunnel(String range) {
		List<SurveyResponse> filtered = filterResponsesByRange(responseService.getAll(), range);

		long totalStarted = filtered.size();
		long totalCompleted = filtered.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete())).count();
		long droppedOff = totalStarted - totalCompleted;

		double startedPerc = totalStarted > 0 ? 100.0 : 0.0;
		double completedPerc = totalStarted > 0 ? ((double) totalCompleted / totalStarted) * 100 : 0.0;
		double droppedPerc = totalStarted > 0 ? ((double) droppedOff / totalStarted) * 100 : 0.0;

		List<FunnelStepDto> steps = List.of(
				new FunnelStepDto("Started", totalStarted, Math.round(startedPerc * 10.0) / 10.0),
				new FunnelStepDto("Completed", totalCompleted, Math.round(completedPerc * 10.0) / 10.0),
				new FunnelStepDto("Dropped Off", droppedOff, Math.round(droppedPerc * 10.0) / 10.0));

		return new CompletionFunnelDto(steps);
	}

	public TestDashboardOverviewDto getOverviewMetrics(String range) {
		List<Survey> allSurveys = surveyService.getAll();
		long totalItems = allSurveys.size();
		long activeItems = surveyService.findAllActive().size();

		List<SurveyResponse> filteredResponses = filterResponsesByRange(responseService.getAll(), range);
		long totalParticipants = filteredResponses.size();

		if (totalParticipants == 0) {
			return new TestDashboardOverviewDto(0, totalItems, activeItems, 0.0, 0.0, 0.0, 0.0);
		}

		long completedCount = filteredResponses.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete())).count();
		double avgCompletion = ((double) completedCount / totalParticipants) * 100;

		List<SurveyResponse> completedResponses = filteredResponses.stream()
				.filter(r -> Boolean.TRUE.equals(r.getIsComplete())).toList();

		double totalScoreSum = 0;
		long passCount = 0;
		long totalDurationSeconds = 0;
		long countWithTime = 0;

		Map<String, Survey> surveyMap = allSurveys.stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(Survey::getId, s -> s, (s1, s2) -> s1));

		for (SurveyResponse response : completedResponses) {
			Survey survey = surveyMap.get(response.getSurveyId());
			if (survey == null)
				continue;

			double score = evaluatePercentageScoreManually(response, survey);
			totalScoreSum += score;

			int threshold = survey.getPassThreshold() != null ? survey.getPassThreshold() : 50;
			if (score >= threshold) {
				passCount++;
			}

			if (response.getSubmittedAt() != null && survey.getCreatedAt() != null) {
				long seconds = Duration.between(survey.getCreatedAt(), response.getSubmittedAt()).toSeconds();
				if (seconds >= 0) {
					totalDurationSeconds += seconds;
					countWithTime++;
				}
			}
		}

		double avgScore = completedResponses.isEmpty() ? 0.0 : (totalScoreSum / completedResponses.size());
		double avgPassRate = completedResponses.isEmpty() ? 0.0
				: (((double) passCount / completedResponses.size()) * 100);

		double avgTimeMinutes = countWithTime > 0 ? ((double) totalDurationSeconds / countWithTime) / 60.0 : 0.0;

		return new TestDashboardOverviewDto(totalParticipants, totalItems, activeItems,
				Math.round(avgCompletion * 10.0) / 10.0, Math.round(avgScore * 10.0) / 10.0,
				Math.round(avgPassRate * 10.0) / 10.0, Math.round(avgTimeMinutes * 10.0) / 10.0);
	}

	public PerformanceAnalysisDto getPerformanceAnalysis(String range) {
		List<SurveyResponse> filteredResponses = filterResponsesByRange(responseService.getAll(), range);
		Map<String, Survey> surveyMap = surveyService.getAll().stream().filter(Objects::nonNull)
				.collect(Collectors.toMap(Survey::getId, s -> s, (s1, s2) -> s1));

		Map<String, List<SurveyResponse>> groupedByMonth = new HashMap<>();
		long cat0_20 = 0, cat21_40 = 0, cat41_60 = 0, cat61_80 = 0, cat81_100 = 0;

		for (SurveyResponse response : filteredResponses) {
			if (response == null || !Boolean.TRUE.equals(response.getIsComplete()) || response.getSubmittedAt() == null)
				continue;
			Survey survey = surveyMap.get(response.getSurveyId());
			if (survey == null)
				continue;

			String monthKey = response.getSubmittedAt().atZone(ZoneOffset.UTC).format(CHART_MONTH_FORMATTER);
			groupedByMonth.computeIfAbsent(monthKey, k -> new ArrayList<>()).add(response);

			double score = evaluatePercentageScoreManually(response, survey);
			if (score <= 20.0)
				cat0_20++;
			else if (score <= 40.0)
				cat21_40++;
			else if (score <= 60.0)
				cat41_60++;
			else if (score <= 80.0)
				cat61_80++;
			else
				cat81_100++;
		}

		List<String> chronologicalMonths = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
				"Nov", "Dec");
		List<MonthlyTrendDto> monthlyTrends = chronologicalMonths.stream().map(month -> {
			List<SurveyResponse> monthlyList = groupedByMonth.getOrDefault(month, Collections.emptyList());
			if (monthlyList.isEmpty())
				return new MonthlyTrendDto(month, 0.0, 0.0);

			double scoreSum = 0;
			long passes = 0;
			for (SurveyResponse r : monthlyList) {
				Survey s = surveyMap.get(r.getSurveyId());
				double score = evaluatePercentageScoreManually(r, s);
				scoreSum += score;
				int th = (s != null && s.getPassThreshold() != null) ? s.getPassThreshold() : 50;
				if (score >= th)
					passes++;
			}
			return new MonthlyTrendDto(month, Math.round((scoreSum / monthlyList.size()) * 10.0) / 10.0,
					Math.round(((double) passes / monthlyList.size()) * 100 * 10.0) / 10.0);
		}).toList();

		return new PerformanceAnalysisDto(monthlyTrends,
				new ScoreDistributionDto(cat0_20, cat21_40, cat41_60, cat61_80, cat81_100));
	}

	public List<TestSummaryDto> getTestsTableSummary(String range) {
		List<Survey> allSurveys = surveyService.getAll();
		List<SurveyResponse> filteredResponses = filterResponsesByRange(responseService.getAll(), range);

		Map<String, List<SurveyResponse>> responsesMap = filteredResponses.stream()
				.filter(r -> r != null && r.getSurveyId() != null && Boolean.TRUE.equals(r.getIsComplete()))
				.collect(Collectors.groupingBy(SurveyResponse::getSurveyId));

		return allSurveys.stream().filter(s -> s != null && !s.isDeleted()).map(survey -> {
			List<SurveyResponse> matches = responsesMap.getOrDefault(survey.getId(), Collections.emptyList());
			long participants = matches.size();

			if (participants == 0) {
				return new TestSummaryDto(survey.getId(), survey.getTitle(),
						survey.getCategory().isEmpty() ? "general" : survey.getCategory().get(0), 0, 0, 0,
						survey.getEstimatedTime() != null ? survey.getEstimatedTime() : 0,
						survey.getStatus() != null ? survey.getStatus().name() : "UNKNOWN");
			}

			double scoreSum = 0;
			long passes = 0;
			long durationSec = 0;
			int threshold = survey.getPassThreshold() != null ? survey.getPassThreshold() : 50;

			for (SurveyResponse r : matches) {
				double score = evaluatePercentageScoreManually(r, survey);
				scoreSum += score;
				if (score >= threshold)
					passes++;
				if (r.getSubmittedAt() != null && survey.getCreatedAt() != null) {
					durationSec += Math.max(0, Duration.between(survey.getCreatedAt(), r.getSubmittedAt()).toSeconds());
				}
			}

			long avgTime = (durationSec / participants) / 60;
			if (avgTime == 0 && survey.getEstimatedTime() != null)
				avgTime = survey.getEstimatedTime();

			return new TestSummaryDto(survey.getId(), survey.getTitle(),
					survey.getCategory().isEmpty() ? "general" : survey.getCategory().get(0), participants,
					(int) Math.round(scoreSum / participants), (int) Math.round(((double) passes / participants) * 100),
					avgTime, survey.getStatus().name());
		}).toList();
	}

	private List<SurveyResponse> filterResponsesByRange(List<SurveyResponse> responses, String range) {
		if ("all".equalsIgnoreCase(range) || range == null)
			return responses;
		Instant limit = switch (range.toLowerCase()) {
		case "today" -> Instant.now().minus(1, ChronoUnit.DAYS);
		case "week" -> Instant.now().minus(7, ChronoUnit.DAYS);
		case "month" -> Instant.now().minus(30, ChronoUnit.DAYS);
		default -> Instant.MIN;
		};
		return responses.stream().filter(r -> r.getSubmittedAt() != null && r.getSubmittedAt().isAfter(limit)).toList();
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

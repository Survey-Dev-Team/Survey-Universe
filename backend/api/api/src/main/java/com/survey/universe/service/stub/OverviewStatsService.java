package com.survey.universe.service.stub;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.web.dto.aggregation.ActivityMetricsDto;
import com.survey.universe.web.dto.aggregation.OverviewStatsDto;
import com.survey.universe.web.dto.aggregation.SurveyTableItemDto;
import com.survey.universe.web.dto.aggregation.TestDashboardOverviewDto;
import com.survey.universe.web.dto.generic.CompletionFunnelDto;
import com.survey.universe.web.dto.generic.FunnelStepDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OverviewStatsService {

	private final UserService userService;
	private final SurveyResponseService responseService;
	private final SurveyService surveyService;

	public OverviewStatsDto getOverviewStatistics() {
		long totalParticipants = userService.getAll().stream().filter(user -> !user.isDeleted()).count();

		List<Survey> allSurveys = surveyService.getAll();
		long totalSurveys = allSurveys.size();
		long activeSurveys = surveyService.findAllActive().size();
		List<SurveyResponse> allResponses = responseService.getAll();

		double avgCompletion = 0.0;
		if (!allResponses.isEmpty()) {
			long completedCount = allResponses.stream()
					.filter(response -> Boolean.TRUE.equals(response.getIsComplete())).count();

			avgCompletion = ((double) completedCount / allResponses.size()) * 100;
		}

		return new OverviewStatsDto(totalParticipants, totalSurveys, activeSurveys, avgCompletion);
	}

	public ActivityMetricsDto getActivityMetrics() {
		List<User> allUsers = userService.getAll();

		DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);

		Map<String, Long> rawMonths = new HashMap<>();

		for (User user : allUsers) {
			if (user != null && !user.isDeleted() && user.getCreatedAt() != null) {
				String monthKey = YearMonth.from(user.getCreatedAt().atZone(ZoneOffset.UTC)).format(monthFormatter);
				rawMonths.put(monthKey, rawMonths.getOrDefault(monthKey, 0L) + 1);
			}
		}

		List<String> chronologicalMonths = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
				"Nov", "Dec");
		Map<String, Long> participantsByMonth = new LinkedHashMap<>();
		chronologicalMonths.forEach(month -> {
			participantsByMonth.put(month, rawMonths.getOrDefault(month, 0L));
		});

		List<Survey> allSurveys = surveyService.getAll();

		Map<String, Long> surveysByCategory = allSurveys.stream()
				.filter(survey -> !survey.isDeleted() && survey.getCategory() != null)
				.flatMap((Survey survey) -> survey.getCategory().stream())
				.collect(Collectors.groupingBy((String category) -> category.toLowerCase(), Collectors.counting()));

		return new ActivityMetricsDto(participantsByMonth, surveysByCategory);
	}

	public List<SurveyTableItemDto> getSurveyTableMetrics() {
		List<SurveyTableItemDto> tableItems = new ArrayList<>();

		List<Survey> allSurveys = surveyService.getAll();
		List<SurveyResponse> allResponses = responseService.getAll();

		Map<String, List<SurveyResponse>> responsesBySurveyId = new HashMap<>();
		for (SurveyResponse response : allResponses) {
			if (response != null && response.getSurveyId() != null) {
				responsesBySurveyId.computeIfAbsent(response.getSurveyId(), k -> new ArrayList<>()).add(response);
			}
		}

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH);

		for (Survey survey : allSurveys) {
			if (survey == null || survey.isDeleted()) {
				continue;
			}

			String surveyId = survey.getId();
			List<SurveyResponse> surveyResponses = responsesBySurveyId.getOrDefault(surveyId, Collections.emptyList());

			long totalParticipants = surveyResponses.size();
			double completionRate = 0.0;

			if (totalParticipants > 0) {
				long completedCount = 0;
				for (SurveyResponse resp : surveyResponses) {
					if (Boolean.TRUE.equals(resp.getIsComplete())) {
						completedCount++;
					}
				}
				completionRate = ((double) completedCount / totalParticipants) * 100;
			}

			String formattedDate = "";
			if (survey.getCreatedAt() != null) {
				formattedDate = survey.getCreatedAt().atZone(ZoneOffset.UTC).format(dateFormatter);
			}

			String statusString = survey.getStatus() != null ? survey.getStatus().name() : "UNKNOWN";

			tableItems.add(new SurveyTableItemDto(survey.getTitle(), survey.getCategory(), totalParticipants,
					Math.round(completionRate * 10.0) / 10.0, statusString, formattedDate));
		}

		tableItems.sort((a, b) -> b.createdDate().compareTo(a.createdDate()));

		return tableItems;
	}

	public TestDashboardOverviewDto getOverviewMetrics(SurveyType type, String timeRangeStr) {
		List<User> allUsers = userService.getAll();
		List<Survey> allSurveys = surveyService.getAll();
		List<SurveyResponse> allResponses = responseService.getAll();

		Instant timeLimit = calculateTimeLimit(timeRangeStr);

		List<Survey> filteredSurveys = new ArrayList<>();
		Set<String> validItemIds = new HashSet<>();
		long activeCount = 0;

		for (Survey s : allSurveys) {
			if (s != null && !s.isDeleted() && s.getSurveyType() == type) {
				if (s.getCreatedAt() != null && s.getCreatedAt().isAfter(timeLimit)) {
					filteredSurveys.add(s);
					validItemIds.add(s.getId());
					if (s.getStatus() == SurveyStatus.PUBLISHED) {
						activeCount++;
					}
				}
			}
		}

		long totalParticipants = 0;
		for (User u : allUsers) {
			if (u != null && !u.isDeleted() && u.getCreatedAt() != null && u.getCreatedAt().isAfter(timeLimit)) {
				totalParticipants++;
			}
		}

		long totalResponsesCount = 0;
		long completedResponsesCount = 0;
		long passedResponsesCount = 0;
		double combinedScoresSum = 0.0;
		long totalEstimatedTimeSum = 0;

		for (SurveyResponse r : allResponses) {
			if (r != null && validItemIds.contains(r.getSurveyId()) && r.getSubmittedAt() != null
					&& r.getSubmittedAt().isAfter(timeLimit)) {
				totalResponsesCount++;

				if (Boolean.TRUE.equals(r.getIsComplete())) {
					completedResponsesCount++;
				}

				if (type == SurveyType.TEST) {
					Survey matchingSurvey = findSurveyById(filteredSurveys, r.getSurveyId());

					if (matchingSurvey != null) {
						double actualScore = calculateTestScore(r);
						combinedScoresSum += actualScore;

						int threshold = matchingSurvey.getPassThreshold() != null ? matchingSurvey.getPassThreshold()
								: 0;
						if (actualScore >= threshold) {
							passedResponsesCount++;
						}

						if (matchingSurvey.getEstimatedTime() != null) {
							totalEstimatedTimeSum += matchingSurvey.getEstimatedTime();
						}
					}
				}
			}
		}

		double avgCompletion = totalResponsesCount > 0 ? ((double) completedResponsesCount / totalResponsesCount) * 100
				: 0.0;
		double avgScore = totalResponsesCount > 0 ? (combinedScoresSum / totalResponsesCount) : 0.0;
		double avgPassRate = totalResponsesCount > 0 ? ((double) passedResponsesCount / totalResponsesCount) * 100
				: 0.0;
		double avgTime = filteredSurveys.size() > 0 ? ((double) totalEstimatedTimeSum / filteredSurveys.size()) : 0.0;

		return new TestDashboardOverviewDto(totalParticipants, filteredSurveys.size(), activeCount,
				Math.round(avgCompletion * 10.0) / 10.0, Math.round(avgScore * 10.0) / 10.0,
				Math.round(avgPassRate * 10.0) / 10.0, Math.round(avgTime * 10.0) / 10.0);
	}

	private Instant calculateTimeLimit(String range) {
		if (range == null)
			return Instant.MIN;
		return switch (range.toLowerCase()) {
		case "3months" -> Instant.now().minus(90, ChronoUnit.DAYS);
		case "6months" -> Instant.now().minus(180, ChronoUnit.DAYS);
		case "year" -> Instant.now().minus(365, ChronoUnit.DAYS);
		default -> Instant.MIN; // "all time"
		};
	}

	private Survey findSurveyById(List<Survey> list, String id) {
		for (Survey s : list) {
			if (s.getId().equals(id))
				return s;
		}
		return null;
	}

	private double calculateTestScore(SurveyResponse response) {
		if (response.getResponseAnswers() == null)
			return 0.0;
		return response.getResponseAnswers().size() * 10.0;
	}
	
	
	
	
	 public CompletionFunnelDTO getCompletionFunnel(SurveyType type, String timeRangeStr) {
	        List<Survey> allSurveys = surveyService.getAll();
	        List<SurveyResponse> allResponses = responseService.getAll();
	        Instant timeLimit = calculateTimeLimit(timeRangeStr);

	        // 1. Індексуємо опитування/тести за ID для швидкого доступу до кількості питань та порогу балів
	        Map<String, Survey> surveyMap = new HashMap<>();
	        for (Survey s : allSurveys) {
	            if (s != null && !s.isDeleted() && s.getSurveyType() == type) {
	                surveyMap.put(s.getId(), s);
	            }
	        }

	        long started = 0;
	        long reached50 = 0;
	        long completed = 0;
	        long passed = 0;

	        // 2. Аналізуємо кожну відповідь
	        for (SurveyResponse response : allResponses) {
	            if (response == null || response.getSubmittedAt() == null || response.getSubmittedAt().isBefore(timeLimit)) {
	                continue;
	            }

	            // Перевіряємо, чи належить відповідь до обраного типу (SURVEY або TEST)
	            Survey survey = surveyMap.get(response.getSurveyId());
	            if (survey == null) {
	                continue; 
	            }

	            // Крок 1: Будь-яка відповідь у системі вважається розпочатою (Started)
	            started++;

	            // Крок 2: Перевірка досягнення 50% питань
	            int totalQuestions = survey.getQuestions() != null ? survey.getQuestions().size() : 0;
	            int answeredQuestions = response.getResponseAnswers() != null ? response.getResponseAnswers().size() : 0;
	            
	            if (totalQuestions > 0 && ((double) answeredQuestions / totalQuestions) >= 0.5) {
	                reached50++;
	            }

	            // Крок 3: Перевірка завершення (Completed)
	            if (Boolean.TRUE.equals(response.getIsComplete())) {
	                completed++;

	                // Крок 4: Перевірка успішного проходження (Passed) — актуально для TEST
	                if (type == SurveyType.TEST) {
	                    double score = calculateTestScore(response);
	                    int threshold = survey.getPassThreshold() != null ? survey.getPassThreshold() : 0;
	                    if (score >= threshold) {
	                        passed++;
	                    }
	                }
	            }
	        }

	        // 3. Розрахунок відсотків відносно етапу "Started" (запобігаємо діленню на нуль)
	        double startedPct = started > 0 ? 100.0 : 0.0;
	        double reached50Pct = started > 0 ? ((double) reached50 / started) * 100 : 0.0;
	        double completedPct = started > 0 ? ((double) completed / started) * 100 : 0.0;
	        double passedPct = started > 0 ? ((double) passed / started) * 100 : 0.0;

	        // 4. Формування списку кроків воронки
	        List<FunnelStepDto> steps = new ArrayList<>();
	        steps.add(new FunnelStepDto("Started", started, Math.round(startedPct)));
	        steps.add(new FunnelStepDto("Reached 50%", reached50, Math.round(reached50Pct)));
	        steps.add(new FunnelStepDto("Completed", completed, Math.round(completedPct)));
	        
	        // Додаємо крок "Passed" лише якщо ми аналізуємо тести, як на макеті
	        if (type == SurveyType.TEST) {
	            steps.add(new FunnelStepDto("Passed", passed, Math.round(passedPct)));
	        }

	        return new CompletionFunnelDto(steps);
	    }

	    private Instant calculateTimeLimit(String range) {
	        if (range == null) return Instant.MIN;
	        return switch (range.toLowerCase()) {
	            case "3months" -> Instant.now().minus(90, ChronoUnit.DAYS);
	            case "6months" -> Instant.now().minus(180, ChronoUnit.DAYS);
	            case "year"    -> Instant.now().minus(365, ChronoUnit.DAYS);
	            default        -> Instant.MIN;
	        };
	    }

	    // Тимчасовий метод підрахунку балів (замініть на вашу логіку оцінювання відповідей)
	    private double calculateTestScore1(SurveyResponse response) {
	        if (response.getResponseAnswers() == null) return 0.0;
	        return response.getResponseAnswers().size() * 10.0; 
	    }
}

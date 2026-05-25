package com.survey.universe.service.stub;

import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.service.SurveyService;
import com.survey.universe.service.UserService;
import com.survey.universe.web.dto.aggregation.ActivityMetricsDto;
import com.survey.universe.web.dto.aggregation.OverviewStatsDto;
import com.survey.universe.web.dto.aggregation.SurveyTableItemDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OverviewStatsService {

	private final UserService userService;
	private final SurveyResponseService responseService;
	private final SurveyService surveyService;

	public OverviewStatsDto getOverviewStatistics(String range) {
		long totalParticipants = userService.getAll().stream().filter(user -> !user.isDeleted()).count();

		List<Survey> filteredSurveys = filterSurveysByRange(surveyService.getAll(), range);
		long totalSurveys = filteredSurveys.size();

		long activeSurveys = surveyService.findAllActive().stream().filter(filteredSurveys::contains).count();

		List<SurveyResponse> filteredResponses = filterResponsesByRange(responseService.getAll(), range);

		double avgCompletion = 0.0;
		if (!filteredResponses.isEmpty()) {
			long completedCount = filteredResponses.stream()
					.filter(response -> Boolean.TRUE.equals(response.getIsComplete())).count();
			avgCompletion = ((double) completedCount / filteredResponses.size()) * 100;
		}

		return new OverviewStatsDto(totalParticipants, totalSurveys, activeSurveys, avgCompletion);
	}

	public ActivityMetricsDto getActivityMetrics(String range) {
		List<User> filteredUsers = filterUsersByRange(userService.getAll(), range);
		DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);
		Map<String, Long> rawMonths = new HashMap<>();

		for (User user : filteredUsers) {
			if (user != null && !user.isDeleted() && user.getCreatedAt() != null) {
				String monthKey = YearMonth.from(user.getCreatedAt().atZone(ZoneOffset.UTC)).format(monthFormatter);
				rawMonths.put(monthKey, rawMonths.getOrDefault(monthKey, 0L) + 1);
			}
		}

		List<String> chronologicalMonths = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
				"Nov", "Dec");
		Map<String, Long> participantsByMonth = new LinkedHashMap<>();
		chronologicalMonths.forEach(month -> participantsByMonth.put(month, rawMonths.getOrDefault(month, 0L)));

		Map<String, Long> surveysByCategory = filterSurveysByRange(surveyService.getAll(), range).stream()
				.filter(survey -> !survey.isDeleted() && survey.getCategory() != null)
				.flatMap(survey -> survey.getCategory().stream())
				.collect(Collectors.groupingBy(String::toLowerCase, Collectors.counting()));

		return new ActivityMetricsDto(participantsByMonth, surveysByCategory);
	}

	public List<SurveyTableItemDto> getSurveyTableMetrics(String range) {
		List<SurveyTableItemDto> tableItems = new ArrayList<>();
		List<Survey> filteredSurveys = filterSurveysByRange(surveyService.getAll(), range);
		List<SurveyResponse> filteredResponses = filterResponsesByRange(responseService.getAll(), range);

		Map<String, List<SurveyResponse>> responsesBySurveyId = filteredResponses.stream()
				.filter(r -> r != null && r.getSurveyId() != null)
				.collect(Collectors.groupingBy(SurveyResponse::getSurveyId));

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH);

		for (Survey survey : filteredSurveys) {
			if (survey == null || survey.isDeleted())
				continue;

			List<SurveyResponse> surveyResponses = responsesBySurveyId.getOrDefault(survey.getId(),
					Collections.emptyList());
			long totalParticipants = surveyResponses.size();
			double completionRate = 0.0;

			if (totalParticipants > 0) {
				long completedCount = surveyResponses.stream().filter(r -> Boolean.TRUE.equals(r.getIsComplete()))
						.count();
				completionRate = ((double) completedCount / totalParticipants) * 100;
			}

			String formattedDate = survey.getCreatedAt() != null
					? survey.getCreatedAt().atZone(ZoneOffset.UTC).format(dateFormatter)
					: "";
			String statusString = survey.getStatus() != null ? survey.getStatus().name() : "UNKNOWN";

			tableItems.add(new SurveyTableItemDto(survey.getTitle(), survey.getCategory(), totalParticipants,
					Math.round(completionRate * 10.0) / 10.0, statusString, formattedDate));
		}

		tableItems.sort((a, b) -> b.createdDate().compareTo(a.createdDate()));
		return tableItems;
	}

	private List<Survey> filterSurveysByRange(List<Survey> surveys, String range) {
		if ("all".equalsIgnoreCase(range) || range == null)
			return surveys;
		Instant limit = getInstantLimit(range);
		return surveys.stream().filter(s -> s.getCreatedAt() != null && s.getCreatedAt().isAfter(limit)).toList();
	}

	private List<SurveyResponse> filterResponsesByRange(List<SurveyResponse> responses, String range) {
		if ("all".equalsIgnoreCase(range) || range == null)
			return responses;
		Instant limit = getInstantLimit(range);
		return responses.stream().filter(r -> r.getSubmittedAt() != null && r.getSubmittedAt().isAfter(limit)).toList();
	}

	private List<User> filterUsersByRange(List<User> users, String range) {
		if ("all".equalsIgnoreCase(range) || range == null)
			return users;
		Instant limit = getInstantLimit(range);
		return users.stream().filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(limit)).toList();
	}

	private Instant getInstantLimit(String range) {
		return switch (range.toLowerCase()) {
		case "today" -> Instant.now().minus(1, ChronoUnit.DAYS);
		case "week" -> Instant.now().minus(7, ChronoUnit.DAYS);
		case "month" -> Instant.now().minus(30, ChronoUnit.DAYS);
		default -> Instant.MIN;
		};
	}
}

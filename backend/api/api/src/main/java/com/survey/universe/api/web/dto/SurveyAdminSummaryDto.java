package com.survey.universe.api.web.dto;

import java.time.Instant;
import java.util.List;

public record SurveyAdminSummaryDto(String surveyId, String urlId, String creatorId, String creatorUrlId, String title,
		String description, String icon, List<String> category, Integer estimatedTime, Instant publishedAt,
		Instant closedAt, Instant createdAt, Instant modifiedAt, String status, boolean isDeleted,
		Integer responseCount) {

}

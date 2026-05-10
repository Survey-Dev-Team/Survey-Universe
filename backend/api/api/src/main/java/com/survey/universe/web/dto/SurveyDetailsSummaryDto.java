package com.survey.universe.web.dto;

import java.time.Instant;
import java.util.List;

import com.survey.universe.domain.constant.SurveyStatus;

public record SurveyDetailsSummaryDto(String surveyId, String urlId, String creatorId, String creatorUrlId, String title,
		String description, String icon, List<String> category, Integer estimatedTime, Instant publishedAt,
		Instant closedAt, Instant createdAt, Instant modifiedAt, SurveyStatus status, boolean isDeleted,
		Integer responseCount) {

}

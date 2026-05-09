package com.survey.universe.api.web.dto;

import java.time.Instant;
import java.util.List;

public record SurveySummaryDto(String urlId, String creatorUrlId, String title, String description, String icon,
		List<String> category, Integer estimatedTime, Instant publishedAt) {

}

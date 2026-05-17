package com.survey.universe.web.dto;

import java.time.Instant;
import java.util.List;

import com.survey.universe.domain.constant.SurveyType;

public record SurveyReadSummaryDto(String urlId, String creatorUrlId, String title, String description, String icon,
		List<String> category, Integer estimatedTime, Instant publishedAt, SurveyType surveyType) {

}

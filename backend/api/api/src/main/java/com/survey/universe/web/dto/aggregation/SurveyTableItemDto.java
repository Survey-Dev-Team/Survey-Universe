package com.survey.universe.web.dto.aggregation;

import java.util.List;

public record SurveyTableItemDto(String title, List<String> categories, long participants, double completionRate,
		String status, String createdDate) {

}

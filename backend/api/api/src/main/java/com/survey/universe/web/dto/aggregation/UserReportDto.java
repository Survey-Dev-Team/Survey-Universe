package com.survey.universe.web.dto.aggregation;

import java.util.List;

public record UserReportDto(List<UserSurveyReportDto> surveys, List<UserTestReportDto> tests) {
}

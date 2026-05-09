package com.survey.universe.api.web.dto.response;

import java.time.Instant;
import java.util.List;

import com.survey.universe.api.web.dto.UserPrivateSummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;

public record UserPrivateResponseDto(UserPrivateSummaryDto userSummary, int surveysCompleted, String revision, Instant lastSession) {

}

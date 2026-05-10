package com.survey.universe.web.dto.response;

import java.time.Instant;
import java.util.List;

import com.survey.universe.web.dto.UserPrivateSummaryDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;

public record UserPrivateResponseDto(UserPrivateSummaryDto userSummary, int surveysCompleted, String revision, Instant lastSession) {

}

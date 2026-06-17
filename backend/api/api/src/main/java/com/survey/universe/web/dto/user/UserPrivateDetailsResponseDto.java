package com.survey.universe.web.dto.user;

import java.time.Instant;

public record UserPrivateDetailsResponseDto(UserPrivateSummaryDto userSummary, int surveysCompleted, String revision, Instant createdAt, Instant lastSession) {

}

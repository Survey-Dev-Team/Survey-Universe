package com.survey.universe.web.dto.aggregation;

import java.time.Instant;

public record UserTableSummaryDto(String id, String firstName, String lastName, String email, String role,
		long surveysCreated, long testsTaken, Instant createdAt, Instant lastSession) {

}

package com.survey.universe.domain.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SurveyStatus {
	DRAFT("draft"), PUBLISHED("published"), CLOSED("closed");

	private final String value;

	SurveyStatus(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

	public static SurveyStatus fromString(String text) {
		for (SurveyStatus status : SurveyStatus.values()) {
			if (status.value.equalsIgnoreCase(text)) {
				return status;
			}
		}
		throw new IllegalArgumentException("Unknown status: " + text);
	}
}
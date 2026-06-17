package com.survey.universe.domain.constant;

import com.fasterxml.jackson.annotation.JsonCreator;
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

	@JsonCreator
	public static SurveyStatus fromString(String text) {
		if (text == null) return null;
		for (SurveyStatus status : SurveyStatus.values()) {
			if (status.value.equalsIgnoreCase(text)) {
				return status;
			}
		}
		return null;
	}
}
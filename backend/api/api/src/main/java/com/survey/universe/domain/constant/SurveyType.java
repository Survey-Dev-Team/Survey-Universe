package com.survey.universe.domain.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SurveyType {

	TEST("test"), QUESTIONNAIRE("questionnaire"), PRESENTATION("presentation");

	private final String value;

	SurveyType(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

	public static SurveyType fromString(String text) {
		for (SurveyType status : SurveyType.values()) {
			if (status.value.equalsIgnoreCase(text)) {
				return status;
			}
		}
		throw new IllegalArgumentException("Unknown status: " + text);
	}
}

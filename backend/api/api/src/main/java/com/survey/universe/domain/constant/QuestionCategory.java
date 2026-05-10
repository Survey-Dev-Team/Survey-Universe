package com.survey.universe.domain.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum QuestionCategory {

	MARKED("marked"), UNMARKED("unmarked"), CONTENT_ONLY("content_only");

	private final String value;

	QuestionCategory(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

	public static QuestionCategory fromString(String text) {
		for (QuestionCategory status : QuestionCategory.values()) {
			if (status.value.equalsIgnoreCase(text)) {
				return status;
			}
		}
		throw new IllegalArgumentException("Unknown status: " + text);
	}
}

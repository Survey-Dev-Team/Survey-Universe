package com.survey.universe.domain.constant;

public enum DocType {
	USER("user:"), SURVEY("survey:"), RESPOSNSE("response:");

	private final String prefix;

	DocType(String prefix) {
		this.prefix = prefix;
	}

	public String join(String id) {
		return prefix + id;
	}

	public String remove(String fullId) {
		return fullId.replace(prefix, "");
	}
}

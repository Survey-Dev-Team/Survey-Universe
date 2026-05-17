package com.survey.universe.domain.constant;

import com.fasterxml.jackson.annotation.JsonValue;

public enum QuestionType {
	RANGE(Constants.RANGE), CHECKBOX(Constants.CHECKBOX), RADIO_BUTTON(Constants.RADIO_BUTTON),
	SEARCH_SELECT(Constants.SEARCH_SELECT), TITLE(Constants.TITLE), TEXT(Constants.TEXT), INPUT(Constants.INPUT),
	TEXT_AREA(Constants.TEXT_AREA), DATE_PICK(Constants.DATE_PICK), FILE_UPLOAD(Constants.FILE_UPLOAD),
	IMAGE(Constants.IMAGE), SPACE(Constants.SPACE), PAGE_BREAK(Constants.PAGE_BREAK);

	private final String value;

	QuestionType(String value) {
		this.value = value;
	}

	@JsonValue
	public String getValue() {
		return value;
	}

	public static final class Constants {
		public static final String RANGE = "range";
		public static final String CHECKBOX = "checkbox";
		public static final String RADIO_BUTTON = "radio_button";
		public static final String SEARCH_SELECT = "search_select";
		public static final String TITLE = "title";
		public static final String TEXT = "text";
		public static final String INPUT = "input";
		public static final String TEXT_AREA = "text_area";
		public static final String DATE_PICK = "date_pick";
		public static final String FILE_UPLOAD = "file_upload";
		public static final String IMAGE = "image";
		public static final String SPACE = "space";
		public static final String PAGE_BREAK = "page_break";
	}
}

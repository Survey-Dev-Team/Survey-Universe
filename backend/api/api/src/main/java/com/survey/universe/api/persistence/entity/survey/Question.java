package com.survey.universe.api.persistence.entity.survey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({ @JsonSubTypes.Type(value = RangeQuestion.class, name = "range"),
		@JsonSubTypes.Type(value = SelectionQuestion.class, names = {"checkbox", "radio_button", "search_select"}),
		@JsonSubTypes.Type(value = OpenFormQuestion.class, names = {"title", "text"}),
		@JsonSubTypes.Type(value = InputQuestion.class, name = "input"),
		@JsonSubTypes.Type(value = TextAreaQuestion.class, name = "text_area"),
		@JsonSubTypes.Type(value = SimpleRespondedQuestion.class, name = "date_pick"),
		@JsonSubTypes.Type(value = FileQuestion.class, names = {"file_upload", "image" }),
		@JsonSubTypes.Type(value = DefaultQuestion.class, names = {"space", "page_break"}) })
public abstract class Question {

	@NotBlank
	@JsonProperty("id")
	private String id;

	@JsonProperty("label")
	private String label;

	@JsonProperty("sort_order")
	private int sortOrder;

	@JsonProperty("type")
	private String type;

	@JsonProperty("is_required")
	private boolean isRequired;

}

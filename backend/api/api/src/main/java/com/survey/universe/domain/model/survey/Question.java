package com.survey.universe.domain.model.survey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.survey.universe.domain.constant.QuestionCategory;
import com.survey.universe.domain.constant.QuestionType;
import com.survey.universe.domain.model.abstraction.QuestionVisitor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({ @JsonSubTypes.Type(value = RangeQuestion.class, name = QuestionType.Constants.RANGE),
		@JsonSubTypes.Type(value = SelectionQuestion.class, names = { QuestionType.Constants.CHECKBOX,
				QuestionType.Constants.RADIO_BUTTON, QuestionType.Constants.SEARCH_SELECT }),
		@JsonSubTypes.Type(value = OpenFormQuestion.class, names = { QuestionType.Constants.TITLE,
				QuestionType.Constants.TEXT }),
		@JsonSubTypes.Type(value = InputQuestion.class, name = QuestionType.Constants.INPUT),
		@JsonSubTypes.Type(value = TextAreaQuestion.class, name = QuestionType.Constants.TEXT_AREA),
		@JsonSubTypes.Type(value = SimpleRespondedQuestion.class, name = QuestionType.Constants.DATE_PICK),
		@JsonSubTypes.Type(value = FileQuestion.class, names = { QuestionType.Constants.FILE_UPLOAD,
				QuestionType.Constants.IMAGE }),
		@JsonSubTypes.Type(value = DefaultQuestion.class, names = { QuestionType.Constants.SPACE,
				QuestionType.Constants.PAGE_BREAK }) })
public abstract class Question {

	@NotBlank
	@JsonProperty("id")
	private String id;

	@JsonProperty("label")
	private String label;

	@JsonProperty("sort_order")
	private int sortOrder;

	@JsonProperty("type")
	private QuestionType type;

	@JsonProperty("is_required")
	private Boolean isRequired;
	
	@JsonProperty("question_category")
	private QuestionCategory questionCategory;

	
    public abstract <T> T accept(QuestionVisitor<T> visitor);

}

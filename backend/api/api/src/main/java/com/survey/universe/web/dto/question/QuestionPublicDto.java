package com.survey.universe.web.dto.question;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.survey.universe.domain.constant.QuestionType;
import com.survey.universe.domain.model.survey.DefaultQuestion;
import com.survey.universe.domain.model.survey.FileQuestion;
import com.survey.universe.domain.model.survey.InputQuestion;
import com.survey.universe.domain.model.survey.OpenFormQuestion;
import com.survey.universe.domain.model.survey.Question;
import com.survey.universe.domain.model.survey.RangeQuestion;
import com.survey.universe.domain.model.survey.SelectionQuestion;
import com.survey.universe.domain.model.survey.SimpleRespondedQuestion;
import com.survey.universe.domain.model.survey.TextAreaQuestion;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({ @JsonSubTypes.Type(value = RangeQuestionPublicDto.class, name = QuestionType.Constants.RANGE),
		@JsonSubTypes.Type(value = SelectionQuestionPublicDto.class, names = { QuestionType.Constants.CHECKBOX,
				QuestionType.Constants.RADIO_BUTTON, QuestionType.Constants.SEARCH_SELECT }),
		@JsonSubTypes.Type(value = OpenFormQuestionPublicDto.class, names = { QuestionType.Constants.TITLE,
				QuestionType.Constants.TEXT }),
		@JsonSubTypes.Type(value = InputQuestionPublicDto.class, name = QuestionType.Constants.INPUT),
		@JsonSubTypes.Type(value = TextAreaQuestionPublicDto.class, name = QuestionType.Constants.TEXT_AREA),
		@JsonSubTypes.Type(value = SimpleRespondedQuestionPublicDto.class, name = QuestionType.Constants.DATE_PICK),
		@JsonSubTypes.Type(value = FileQuestionPublicDto.class, names = { QuestionType.Constants.FILE_UPLOAD,
				QuestionType.Constants.IMAGE }),
		@JsonSubTypes.Type(value = DefaultQuestionPublicDto.class, names = { QuestionType.Constants.SPACE,
				QuestionType.Constants.PAGE_BREAK }) })
public abstract class QuestionPublicDto {

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
}

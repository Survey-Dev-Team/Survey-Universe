package com.survey.universe.web.dto.question.details;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.survey.universe.domain.constant.QuestionType;
import com.survey.universe.web.dto.question.QuestionDto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({ @JsonSubTypes.Type(value = RangeQuestionDetailsDto.class, name = QuestionType.Constants.RANGE),
		@JsonSubTypes.Type(value = SelectionQuestionDetailsDto.class, names = { QuestionType.Constants.CHECKBOX,
				QuestionType.Constants.RADIO_BUTTON, QuestionType.Constants.SEARCH_SELECT }),
		@JsonSubTypes.Type(value = OpenFormQuestionDetailsDto.class, names = { QuestionType.Constants.TITLE,
				QuestionType.Constants.TEXT }),
		@JsonSubTypes.Type(value = InputQuestionDetailsDto.class, name = QuestionType.Constants.INPUT),
		@JsonSubTypes.Type(value = TextAreaQuestionDetailsDto.class, name = QuestionType.Constants.TEXT_AREA),
		@JsonSubTypes.Type(value = SimpleRespondedQuestionDetailsDto.class, name = QuestionType.Constants.DATE_PICK),
		@JsonSubTypes.Type(value = FileQuestionDetailsDto.class, names = { QuestionType.Constants.FILE_UPLOAD,
				QuestionType.Constants.IMAGE }),
		@JsonSubTypes.Type(value = DefaultQuestionDetailsDto.class, names = { QuestionType.Constants.SPACE,
				QuestionType.Constants.PAGE_BREAK }) })
public abstract class QuestionDetailsDto extends QuestionDto {
	
}

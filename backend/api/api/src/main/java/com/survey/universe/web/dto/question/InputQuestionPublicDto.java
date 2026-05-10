package com.survey.universe.web.dto.question;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class InputQuestionPublicDto extends TextAreaQuestionPublicDto {

	@JsonProperty("input_type")
	private String inputType;
}

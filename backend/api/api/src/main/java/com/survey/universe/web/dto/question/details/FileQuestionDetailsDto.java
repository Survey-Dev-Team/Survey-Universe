package com.survey.universe.web.dto.question.details;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileQuestionDetailsDto extends OpenFormQuestionDetailsDto {

	@JsonProperty("link")
	private String link;
}

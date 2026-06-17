package com.survey.universe.web.dto.question.read;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileQuestionPublicDto extends OpenFormQuestionPublicDto {

	@JsonProperty("link")
	private String link;
}

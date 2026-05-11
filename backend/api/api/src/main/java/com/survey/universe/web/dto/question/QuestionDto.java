package com.survey.universe.web.dto.question;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.survey.universe.domain.constant.QuestionType;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class QuestionDto {

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

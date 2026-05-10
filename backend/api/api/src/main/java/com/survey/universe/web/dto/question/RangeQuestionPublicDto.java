package com.survey.universe.web.dto.question;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RangeQuestionPublicDto extends QuestionPublicDto {

	@JsonProperty("min")
	private Integer min;

	@JsonProperty("max")
	private Integer max;

	@JsonProperty("step")
	private Integer step;
}

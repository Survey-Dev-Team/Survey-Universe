package com.survey.universe.api.persistence.entity.survey;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FileQuestion extends OpenFormQuestion {


	@JsonProperty("link")
	private String link;
	
}

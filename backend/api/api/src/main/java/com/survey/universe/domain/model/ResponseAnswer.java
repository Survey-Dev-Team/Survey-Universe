package com.survey.universe.domain.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ResponseAnswer {
	
	@NotBlank
	@JsonProperty("id")
	private String id;
	
	@JsonProperty("value")
	private String value;
	
	@JsonProperty("selected_options")
	private List<String> selectedOptions;

}

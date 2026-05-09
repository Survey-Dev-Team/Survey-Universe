package com.survey.universe.api.persistence.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResponseAnswer {
	
	@NotBlank
	@JsonProperty("id")
	private String id;
	
	@JsonProperty("value")
	private String value;
	
	@JsonProperty("selected_options")
	private List<String> selectedOptions = new ArrayList<>();

}

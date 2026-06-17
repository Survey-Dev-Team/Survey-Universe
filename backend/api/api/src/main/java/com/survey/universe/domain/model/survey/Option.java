package com.survey.universe.domain.model.survey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Option {

    @NonNull
    @JsonProperty("id")
    private String id;

    @NonNull
    @JsonProperty("label")
    private String label;

    @NonNull
    @JsonProperty("sort_order")
    private Integer sortOrder;

    @JsonProperty("correct")
    private Boolean correct;
}


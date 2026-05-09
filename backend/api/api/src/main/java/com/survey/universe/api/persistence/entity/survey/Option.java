package com.survey.universe.api.persistence.entity.survey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
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
    private boolean correct;
}


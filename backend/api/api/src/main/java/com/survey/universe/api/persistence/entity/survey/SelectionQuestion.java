package com.survey.universe.api.persistence.entity.survey;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SelectionQuestion extends Question {

    @Valid 
    @JsonProperty("options")
    private List<Option> options = new ArrayList<>();
}

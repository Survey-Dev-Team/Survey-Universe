package com.survey.universe.web.dto.question.read;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OptionPublicDto(@NotBlank String id, @NotBlank String label, @NotBlank Integer sortOrder) {
}

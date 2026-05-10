package com.survey.universe.web.dto.question;

import jakarta.validation.constraints.NotBlank;

public record OptionPublicDto(@NotBlank String id, @NotBlank String label, @NotBlank Integer sortOrder) {
}

package com.survey.universe.web.dto.generic;

import jakarta.validation.constraints.NotBlank;

public record RevisionRecordDto(@NotBlank String revision) {

}

package com.survey.universe.api.web.dto.request;

import jakarta.validation.constraints.NotNull;

public record RefreshRequestDto(@NotNull String refreshToken) {
}

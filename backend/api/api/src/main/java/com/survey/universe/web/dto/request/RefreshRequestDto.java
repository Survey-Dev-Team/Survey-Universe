package com.survey.universe.web.dto.request;

import jakarta.validation.constraints.NotNull;

public record RefreshRequestDto(@NotNull String refreshToken) {
}

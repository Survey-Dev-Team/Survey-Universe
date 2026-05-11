package com.survey.universe.web.dto.auth.request;

import jakarta.validation.constraints.NotNull;

public record TokenRefreshRequestDto(@NotNull String refreshToken) {
}

package com.survey.universe.web.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserLoginRequestDto(@NotBlank @Email(message = "Incorrect email format") String email, @NotBlank String password) {

}

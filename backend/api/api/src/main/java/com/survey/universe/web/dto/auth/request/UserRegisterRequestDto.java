package com.survey.universe.web.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserRegisterRequestDto(@NotBlank String firstName, @NotBlank String lastName,
		@NotBlank @Email(message = "Incorrect email format") String email,
		@NotBlank @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
		message = "Password must be at least 8 symbols long and contain a number and at least 1 uppercase and lowercase letter") 
		String password) {
}

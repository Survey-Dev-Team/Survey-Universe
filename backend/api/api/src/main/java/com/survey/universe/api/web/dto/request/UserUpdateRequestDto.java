package com.survey.universe.api.web.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequestDto(String firstName, String lastName, String email, String profileImage,
		@NotBlank String revision) {

}

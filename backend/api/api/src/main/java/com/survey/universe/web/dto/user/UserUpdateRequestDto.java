package com.survey.universe.web.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserUpdateRequestDto(String firstName, String lastName, String profileImage,
		@NotBlank String revision) {

}

package com.survey.universe.web.dto.generic;

import com.survey.universe.web.dto.inheritable.ConditionalResponseDto;

public record MessageDto(String message) implements ConditionalResponseDto {
}

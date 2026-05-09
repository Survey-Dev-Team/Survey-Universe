package com.survey.universe.api.web.dto.response;

import com.survey.universe.api.web.dto.UserPrivateSummaryDto;

public record UserLoginResponseDto(String jwtToken, String refreshToken, String tokenType, long expiresIn,
		UserPrivateSummaryDto userSummary) {

}

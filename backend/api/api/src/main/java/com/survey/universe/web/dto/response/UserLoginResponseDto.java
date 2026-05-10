package com.survey.universe.web.dto.response;

import com.survey.universe.web.dto.UserPrivateSummaryDto;

public record UserLoginResponseDto(String jwtToken, String refreshToken, String tokenType, long expiresIn,
		UserPrivateSummaryDto userSummary) {

}

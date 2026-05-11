package com.survey.universe.web.dto.auth.response;

import com.survey.universe.web.dto.user.UserPrivateSummaryDto;

public record UserAuthResponseDto(String jwtToken, String refreshToken, String tokenType, long expiresIn,
		UserPrivateSummaryDto userSummary) {

}

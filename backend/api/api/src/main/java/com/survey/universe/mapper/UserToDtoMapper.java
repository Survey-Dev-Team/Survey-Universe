package com.survey.universe.mapper;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.User;
import com.survey.universe.web.dto.auth.response.UserAuthResponseDto;
import com.survey.universe.web.dto.auth.response.UserRegisterResponseDto;
import com.survey.universe.web.dto.user.UserPrivateDetailsResponseDto;
import com.survey.universe.web.dto.user.UserPrivateSummaryDto;
import com.survey.universe.web.dto.user.UserPublicSummaryDto;

@Component
public class UserToDtoMapper {

	public UserRegisterResponseDto toRegisterDto(User user) {
		return new UserRegisterResponseDto(user.getEmail(), user.getFirstName(), user.getLastName());
	}

	public UserAuthResponseDto toAuthDto(String accessToken, String refreshToken, String tokenType, long expirationTimeMs,
			User user, String urlId) {
		return new UserAuthResponseDto(accessToken, refreshToken, tokenType, expirationTimeMs,
				toUserPrivateSummaryDto(user, urlId));
	}

	public UserPrivateSummaryDto toUserPrivateSummaryDto(User user, String urlId) {
		return new UserPrivateSummaryDto(user.getId(), urlId, user.getProfileImage(), user.getFirstName(),
				user.getLastName(), user.getRole(), user.getEmail());
	}

	public UserPublicSummaryDto toUserPublicSummaryDto(User user, String urlId) {
		return new UserPublicSummaryDto(urlId, user.getProfileImage(), user.getFirstName(), user.getLastName());
	}

	public UserPrivateDetailsResponseDto toUserPrivateDetailsDto(User user, String urlId, int responseCount) {
		return new UserPrivateDetailsResponseDto(toUserPrivateSummaryDto(user, urlId), responseCount, user.getRevision(),
				user.getCreatedAt(), user.getLastSession());
	}
}

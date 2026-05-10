package com.survey.universe.service.stub;

import java.time.Instant;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.RefreshToken;
import com.survey.universe.domain.storage.stub.StubRefreshTokenStorage;
import com.survey.universe.service.RefreshTokenService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubRefreshTokenService implements RefreshTokenService {

	private final StubRefreshTokenStorage refreshTokens;
	private final UUIDGenerator uuid7;
	
	@Override
	public RefreshToken add(String token, Instant expiry, String userId) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setId("token:" + uuid7.generateUUIDv7());
		refreshToken.setToken(token);
		refreshToken.setUserId(userId);
		refreshToken.setExpiryDate(expiry);
		return refreshTokens.add(refreshToken);
	}

	@Override
	public Optional<RefreshToken> findByToken(String token) {
		return refreshTokens.findByToken(token);
	}

	@Override
	public RefreshToken delete(RefreshToken refreshToken) {
		return refreshTokens.delete(refreshToken);
	}
}

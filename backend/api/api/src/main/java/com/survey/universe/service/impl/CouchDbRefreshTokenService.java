package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.RefreshToken;
import com.survey.universe.domain.repository.CouchDbRefreshTokenRepository;
import com.survey.universe.service.RefreshTokenService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import java.time.Instant;
import java.util.Optional;

@Service
@Primary
@AllArgsConstructor
public class CouchDbRefreshTokenService implements RefreshTokenService {

	private final CouchDbRefreshTokenRepository repository;
	private final UUIDGenerator uuid7;

	@Override
	public RefreshToken add(String token, Instant expiry, String userId) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setId("token:" + uuid7.generateUUIDv7());
		refreshToken.setToken(token);
		refreshToken.setUserId(userId);
		refreshToken.setExpiryDate(expiry);

		return repository.save(refreshToken);
	}

	@Override
	public Optional<RefreshToken> findByToken(String token) {
		return repository.findByToken(token);
	}

	@Override
	public RefreshToken delete(RefreshToken refreshToken) {
		repository.delete(refreshToken);
		return refreshToken;
	}
}

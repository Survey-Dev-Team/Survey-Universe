package com.survey.universe.service;

import java.time.Instant;
import java.util.Optional;

import com.survey.universe.domain.model.RefreshToken;

public interface RefreshTokenService {
		
	public Optional<RefreshToken> findByToken(String token);

	public RefreshToken add(String token, Instant expiry, String userId);
	
	public RefreshToken delete(RefreshToken refreshToken);
}

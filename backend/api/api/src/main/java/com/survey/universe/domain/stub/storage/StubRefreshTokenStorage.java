package com.survey.universe.domain.stub.storage;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.RefreshToken;

@Component
@Profile("test")
public class StubRefreshTokenStorage {
	
	private Map<String, RefreshToken> tokens = new HashMap<>();
	
	public RefreshToken add(RefreshToken token) {
		tokens.put(token.getToken(), token);
		return token;
		
	}

	public Optional<RefreshToken> findByToken(String token) {
		return Optional.ofNullable(tokens.get(token));
	}
	
	public RefreshToken delete(RefreshToken refreshToken) {
		tokens.remove(refreshToken.getToken());
		return refreshToken;
	}
}

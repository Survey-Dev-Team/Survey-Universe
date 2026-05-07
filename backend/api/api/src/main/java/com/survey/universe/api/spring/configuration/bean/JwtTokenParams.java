package com.survey.universe.api.spring.configuration.bean;

import org.springframework.beans.factory.annotation.Value;

public class JwtTokenParams {

	@Value("${spring.config.jwt.secret}")
	private String jwtSecret;
	
	@Value("${spring.config.jwt.token.expiration.access}")
	private long accessExpiration;
	
	@Value("${spring.config.jwt.token.expiration.refresh}")
	private long refreshExpiration;

	public String getJwtSecret() {
		return jwtSecret;
	}

	public long getAccessTokenExpirationTime() {
		return accessExpiration;
	}
	
	public long getRefreshTokenExpirationTime() {
		return refreshExpiration;
	}
}

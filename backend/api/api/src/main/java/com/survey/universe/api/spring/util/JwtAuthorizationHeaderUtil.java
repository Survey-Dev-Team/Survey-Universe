package com.survey.universe.api.spring.util;

import org.springframework.stereotype.Component;

@Component
public class JwtAuthorizationHeaderUtil {

	static public final String AUTHORIZATION_HEADER_TYPE = "Bearer ";
	
	public String extractToken(String header) {
		return header.substring(AUTHORIZATION_HEADER_TYPE.length()).trim();
	}
}

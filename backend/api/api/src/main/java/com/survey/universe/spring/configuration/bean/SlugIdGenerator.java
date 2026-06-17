package com.survey.universe.spring.configuration.bean;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@Component("slugIdGenerator")
@AllArgsConstructor
public class SlugIdGenerator {

	private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64 = Base64.getUrlEncoder().withoutPadding();

	
	public String generate() {
		byte[] randomBytes = new byte[12]; 
	    secureRandom.nextBytes(randomBytes);
		return base64.encodeToString(randomBytes);
	}
	
}

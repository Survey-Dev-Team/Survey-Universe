package com.survey.universe.spring.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;

import org.springframework.stereotype.Component;

@Component
public class Base64Util {
	
	private Encoder encoder = Base64.getUrlEncoder();
	private Decoder decoder = Base64.getUrlDecoder();
	
	public String encode(String decoded) {
		return encoder.encodeToString(decoded.getBytes());
	}
	
	public String decode(String encoded) {
		return new String(decoder.decode(encoded), StandardCharsets.UTF_8);
	}

}

package com.survey.universe.api.spring.util;

import org.springframework.stereotype.Component;

import com.survey.universe.api.persistence.constant.DocType;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class Base64UrlUtil {
	
	private final Base64Util base64;
	
	public String encode(String id, DocType prefix) {
		return base64.encode(prefix.remove(id));
	}
	
	public String decode(String url, DocType prefix) {
		return prefix.join(base64.decode(url));
	}

}

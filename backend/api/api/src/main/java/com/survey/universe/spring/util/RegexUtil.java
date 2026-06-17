package com.survey.universe.spring.util;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class RegexUtil {

	public boolean match(String regex, String validatedString) {
		return Pattern.compile(regex).matcher(validatedString).matches();
	}
}

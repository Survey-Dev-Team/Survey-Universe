package com.survey.universe.api.spring.util;

import java.time.Instant;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class ExpirationCalculatorUtil {

	public Date calculateDate(int expirationMillis) {
		return new Date(System.currentTimeMillis() + expirationMillis);
	}
	
	public Instant calculateInstant(int expirationMillis) {
		return calculateDate(expirationMillis).toInstant();
	}
}

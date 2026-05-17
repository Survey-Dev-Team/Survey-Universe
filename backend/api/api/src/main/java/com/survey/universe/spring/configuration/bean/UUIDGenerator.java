package com.survey.universe.spring.configuration.bean;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.github.f4b6a3.uuid.UuidCreator;

@Component
public class UUIDGenerator {

	public String generateUUIDv7() {
		UUID v7 = UuidCreator.getTimeOrderedEpoch();
		return v7.toString();
			
	}
}

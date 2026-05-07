package com.survey.universe.api.spring.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.survey.universe.api.spring.configuration.bean.JwtTokenParams;


@Configuration
public class JwtTokenConfiguration {

	@Bean
	public JwtTokenParams jwtTokenParams() {
		return new JwtTokenParams();
	}
}

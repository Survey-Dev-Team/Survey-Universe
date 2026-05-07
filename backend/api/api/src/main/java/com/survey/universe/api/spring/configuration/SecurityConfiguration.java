package com.survey.universe.api.spring.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.survey.universe.api.spring.filter.JwtTokenFilter;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfiguration {

	private final JwtTokenFilter jwtTokenFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.cors(AbstractHttpConfigurer::disable).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(request -> {
					request.requestMatchers("/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
							.permitAll().anyRequest().authenticated();
				}).sessionManagement(sessionManagementCustomizer -> {
					sessionManagementCustomizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
				}).addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class).build();
	}

	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowCredentials(true);
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");
		configuration.addAllowedOrigin("*");

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return new CorsFilter(source);
	}
}

package com.survey.universe.spring.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.survey.universe.exception.type.UnauthorizedException;
import com.survey.universe.spring.configuration.UserPrincipal;

public class UserAuthContextUtil {

	private static UserPrincipal getPrincipal() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
			return principal; 
		}
		throw new UnauthorizedException("User session not found");
	}
	
	public static String getCurrentUserId() {
		return getPrincipal().id();
	}
	
	public static String getRole() {
		return getPrincipal().role();

	}
}

package com.survey.universe.spring.util;

import java.nio.file.attribute.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.survey.universe.domain.model.User;
import com.survey.universe.exception.type.UnauthorizedException;

public class UserAuthContextUtil {

	private static User getPrincipal() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
			return (User) principal; 
		}
		throw new UnauthorizedException("User session not found");
	}
	
	public static String getCurrentUserId() {
		return getPrincipal().getId();
	}
	
	public static String getRole() {
		return getPrincipal().getRole();

	}
}

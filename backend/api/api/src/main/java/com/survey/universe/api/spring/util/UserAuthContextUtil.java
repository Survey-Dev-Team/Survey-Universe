package com.survey.universe.api.spring.util;

import java.nio.file.attribute.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.survey.universe.api.exception.type.UnauthorizedException;
import com.survey.universe.api.persistence.entity.User;

public class UserAuthContextUtil {

	public static String getCurrentUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
			return ((User) principal).getId(); 
		}
		throw new UnauthorizedException("User session not found");
	}
}

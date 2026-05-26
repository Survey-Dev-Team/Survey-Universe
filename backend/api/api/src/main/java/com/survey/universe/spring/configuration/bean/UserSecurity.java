package com.survey.universe.spring.configuration.bean;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.exception.type.UnauthorizedException;
import com.survey.universe.service.UserService;
import com.survey.universe.spring.configuration.UserPrincipal;
import com.survey.universe.spring.util.Base64UrlUtil;

import lombok.AllArgsConstructor;

@Component("userSecurity")
@AllArgsConstructor
public class UserSecurity {

	private final Base64UrlUtil base64Url;

	private UserService userService;

	public boolean isOwner(Authentication authentication, String urlId) {
		UserPrincipal user = (UserPrincipal) authentication.getPrincipal();

		return user.id().equals(userService.findBySlugId(urlId)
				.orElseThrow(() -> new UnauthorizedException("You are unauthorized to perform this action")).getId());
	}
}

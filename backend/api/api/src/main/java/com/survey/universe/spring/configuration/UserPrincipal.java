package com.survey.universe.spring.configuration;

import java.util.Collection;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public record UserPrincipal(String id, String email, String role, Collection<? extends GrantedAuthority> authorities)
		implements UserDetails {

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public @Nullable String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return email;
	}
}

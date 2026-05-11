package com.survey.universe.spring.filter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.survey.universe.domain.model.User;
import com.survey.universe.service.UserService;
import com.survey.universe.spring.configuration.UserPrincipal;
import com.survey.universe.spring.util.JwtAuthorizationHeaderUtil;
import com.survey.universe.spring.util.JwtTokenUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

	private final JwtAuthorizationHeaderUtil jwtAuthorizationHeaderUtil;

	private final JwtTokenUtil jwtTokenUtil;

	private final UserService userService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header == null || !header.startsWith(JwtAuthorizationHeaderUtil.AUTHORIZATION_HEADER_TYPE)) {
			filterChain.doFilter(request, response);
			return;
		}
		String token = jwtAuthorizationHeaderUtil.extractToken(header);

		if (jwtTokenUtil.validateAccessToken(token)) {
			String email = jwtTokenUtil.getEmail(token);
			Optional<User> user = userService.findByEmail(email);
			if (user.isPresent()) {
				User userRecord = user.get();
				List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + userRecord.getRole().toUpperCase()));
				
				UserPrincipal userPrincipal = new UserPrincipal(userRecord.getId(), userRecord.getEmail(), userRecord.getRole(), authorities);
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userPrincipal,
						null, authorities);
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}
		filterChain.doFilter(request, response);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();

		return path.contains("/auth") || path.contains("/v3/api-docs")
				|| path.contains("/swagger-ui");
	}
}

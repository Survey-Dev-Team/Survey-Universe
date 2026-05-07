package com.survey.universe.api.service.stub;

import java.time.Instant;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.survey.universe.api.exception.type.InvalidCredentialsException;
import com.survey.universe.api.exception.type.UserAlreadyExistsException;
import com.survey.universe.api.persistence.entity.RefreshToken;
import com.survey.universe.api.persistence.entity.User;
import com.survey.universe.api.service.RefreshTokenService;
import com.survey.universe.api.service.UserAuthService;
import com.survey.universe.api.service.UserService;
import com.survey.universe.api.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.api.spring.util.JwtTokenUtil;
import com.survey.universe.api.web.dto.UserSummaryDto;
import com.survey.universe.api.web.dto.request.RefreshRequestDto;
import com.survey.universe.api.web.dto.request.UserLoginRequestDto;
import com.survey.universe.api.web.dto.request.UserRegisterRequestDto;
import com.survey.universe.api.web.dto.response.UserLoginResponseDto;
import com.survey.universe.api.web.dto.response.UserRegisterResponseDto;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubAuthService implements UserAuthService {

	private final UserService userService;
	private final UUIDGenerator uuidGenerator;
	private final JwtTokenUtil jwtTokenUtil;
	private final PasswordEncoder passwordEncoder;
	private final RefreshTokenService refreshTokens;

	@PostConstruct
	private void init() {
		User user1 = new User();
		user1.setId("user:019de942-9929-7fe2-a364-530aba65d8d8");
		user1.setEmail("hajamag257@lohinja.com");
		user1.setPassword(passwordEncoder.encode("iE)+Z-a8@_GP"));
		user1.setFirstName("Jaxson");
		user1.setLastName("Stokes");
		user1.setRole("admin");
		userService.add(user1);
		
		User user2 = new User();
		user1.setId("user:019de94a-d11f-761e-ba08-8f389fa1c4ff");
		user1.setEmail("bv7oo@deltajohnsons.com");
		user1.setPassword(passwordEncoder.encode("49Z=g6Yl,gX~"));
		user1.setFirstName("Emily");
		user1.setLastName("Bean");
		user1.setRole("user");
		userService.add(user2);
		
		User user3 = new User();
		user1.setId("user:019de94b-06be-7bf6-a972-ce3da920d965");
		user1.setEmail("2ft12@deltajohnsons.com");
		user1.setPassword(passwordEncoder.encode("7;8Sf1uVrQQD"));
		user1.setFirstName("Edie");
		user1.setLastName("Levine");
		user1.setRole("admin");
		userService.add(user3);
		
	}
	
	@Override
	public UserRegisterResponseDto registerUser(UserRegisterRequestDto registerDto) {
		User user = new User();
		user.setId("user:" + uuidGenerator.generateUUIDv7());
		user.setEmail(registerDto.email());
		user.setPassword(passwordEncoder.encode(registerDto.password()));
		user.setFirstName(registerDto.firstName());
		user.setLastName(registerDto.lastName());
		user.setRole("user");

		Optional<User> addedUser = userService.add(user);
		if (addedUser.isEmpty()) {
			throw new UserAlreadyExistsException("User with these primary credentials already exists");
		}
		return new UserRegisterResponseDto(user.getEmail(), user.getFirstName(), user.getLastName());
	}

	@Override
	public UserLoginResponseDto loginUser(UserLoginRequestDto loginDto) {
		Optional<User> user = userService.findByEmail(loginDto.email());

		if (user.isEmpty()) {
			throw new InvalidCredentialsException("Invalid login credentials");
		}
		User userDocument = user.get();
		if (!passwordEncoder.matches(loginDto.password(), userDocument.getPassword())) {
			throw new InvalidCredentialsException("Invalid login credentials");
		}

		userDocument.setLastSession(Instant.now());
		userService.update(userDocument);

		UserSummaryDto userSummary = new UserSummaryDto(userDocument.getId(), userDocument.getFirstName(),
				userDocument.getLastName(), userDocument.getRole(), userDocument.getEmail());

		String jwtToken = jwtTokenUtil.generateAccessToken(userDocument.getEmail());
		String refreshToken = jwtTokenUtil.generateRefreshToken(userDocument.getEmail());

		refreshTokens.add(refreshToken, Instant.now().plusMillis(jwtTokenUtil.getRefreshTokenExpirationTime()),
				userDocument.getId());

		long expirationTimeMs = jwtTokenUtil.getAccessTokenExpirationTime();

		return new UserLoginResponseDto(jwtToken, refreshToken, "Bearer", expirationTimeMs, userSummary);
	}

	@Override
	public UserLoginResponseDto refreshAccessToken(RefreshRequestDto refreshDto) {
		String refreshToken = refreshDto.refreshToken();
		if (!jwtTokenUtil.validateRefreshToken(refreshDto.refreshToken())) {
			throw new InvalidCredentialsException("Refresh token is expired or invalid");
		}

		RefreshToken oldRefreshToken = refreshTokens.findByToken(refreshToken).orElseThrow(
				() -> new InvalidCredentialsException("Refresh token does not exist for the user or is expired"));
		refreshTokens.delete(oldRefreshToken);

		String email = jwtTokenUtil.getEmail(refreshToken);

		User userDocument = userService.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found"));

		String newAccessToken = jwtTokenUtil.generateAccessToken(email);
		String newRefreshToken = jwtTokenUtil.generateRefreshToken(email);

		refreshTokens.add(newRefreshToken, Instant.now().plusMillis(jwtTokenUtil.getRefreshTokenExpirationTime()),
				userDocument.getId());
		
		UserSummaryDto userSummary = new UserSummaryDto(userDocument.getId(), userDocument.getFirstName(), userDocument.getLastName(),
				userDocument.getRole(), userDocument.getEmail());

		return new UserLoginResponseDto(newAccessToken, newRefreshToken, "Bearer",
				jwtTokenUtil.getAccessTokenExpirationTime(), userSummary);
	}
}

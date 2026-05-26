package com.survey.universe.service.stub;

import java.time.Instant;

import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.RefreshToken;
import com.survey.universe.domain.model.User;
import com.survey.universe.exception.type.InternalConflictException;
import com.survey.universe.exception.type.InvalidCredentialsException;
import com.survey.universe.exception.type.UnauthorizedException;
import com.survey.universe.mapper.DtoToUserMapper;
import com.survey.universe.mapper.UserToDtoMapper;
import com.survey.universe.service.RefreshTokenService;
import com.survey.universe.service.UserAuthService;
import com.survey.universe.service.UserService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;
import com.survey.universe.spring.util.JwtTokenUtil;
import com.survey.universe.web.dto.auth.request.TokenRefreshRequestDto;
import com.survey.universe.web.dto.auth.request.UserLoginRequestDto;
import com.survey.universe.web.dto.auth.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.auth.response.UserAuthResponseDto;
import com.survey.universe.web.dto.auth.response.UserRegisterResponseDto;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubAuthFacadeService implements UserAuthService {

	private final UserService userService;
	private final UUIDGenerator uuidGenerator;
	private final JwtTokenUtil jwtTokenUtil;
	private final PasswordEncoder passwordEncoder;
	private final RefreshTokenService refreshTokens;
	private final DtoToUserMapper dtoToUser;
	private final UserToDtoMapper userToDto;

	private UserAuthResponseDto authorize(User user) {
		String accessToken = jwtTokenUtil.generateAccessToken(user.getEmail());
		String refreshToken = jwtTokenUtil.generateRefreshToken(user.getEmail());

		refreshTokens.add(refreshToken, Instant.now().plusMillis(jwtTokenUtil.getRefreshTokenExpirationTime()),
				user.getId());

		return userToDto.toAuthDto(accessToken, refreshToken, "Bearer", jwtTokenUtil.getAccessTokenExpirationTime(),
				user, user.getSlugId());
	}

	@Override
	public UserRegisterResponseDto registerUser(UserRegisterRequestDto registerDto) {
		String generatedId = "user:" + uuidGenerator.generateUUIDv7();

		User user = dtoToUser.toRegisteredUser(generatedId, passwordEncoder.encode(registerDto.password()),
				registerDto);

		userService.add(user).orElseThrow(() -> new InternalConflictException(
				"User with these primary credentials already exists or could not be registered at the time, please try again"));

		return userToDto.toRegisterDto(user);
	}

	@Override
	public UserAuthResponseDto loginUser(UserLoginRequestDto loginDto) {
		User userFromIndex = userService.findByEmail(loginDto.email())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid login credentials"));

		if (userFromIndex.isDeleted()) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}

		if (!passwordEncoder.matches(loginDto.password(), userFromIndex.getPassword())) {
			throw new InvalidCredentialsException("Invalid login credentials");
		}

		User freshDbUser = userService.findById(userFromIndex.getId())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid login credentials"));

		freshDbUser.setLastSession(Instant.now());
		User updatedUser = userService.update(freshDbUser)
				.orElseThrow(() -> new InternalConflictException("Internal error while logging in, try again later"));

		return authorize(updatedUser);
	}

	@Override
	public UserAuthResponseDto refreshAccessToken(TokenRefreshRequestDto refreshDto) {
		String refreshToken = refreshDto.refreshToken();

		if (!jwtTokenUtil.validateRefreshToken(refreshToken)) {
			throw new InvalidCredentialsException("Refresh token is expired or invalid");
		}

		String email = jwtTokenUtil.getEmail(refreshToken);

		User userFromIndex = userService.findByEmail(email)
				.orElseThrow(() -> new InvalidCredentialsException("User not found"));

		if (userFromIndex.isDeleted()) {
			throw new UnauthorizedException("User unauthorized to perform this action");
		}

		RefreshToken oldRefreshToken = refreshTokens.findByToken(refreshToken).orElseThrow(
				() -> new InvalidCredentialsException("Refresh token does not exist for the user or is expired"));
		refreshTokens.delete(oldRefreshToken);

		User freshDbUser = userService.findById(userFromIndex.getId())
				.orElseThrow(() -> new InvalidCredentialsException("User not found"));

		return authorize(freshDbUser);
	}
}

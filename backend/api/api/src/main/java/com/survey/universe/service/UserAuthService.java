package com.survey.universe.service;

import com.survey.universe.web.dto.auth.request.TokenRefreshRequestDto;
import com.survey.universe.web.dto.auth.request.UserLoginRequestDto;
import com.survey.universe.web.dto.auth.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.auth.response.UserAuthResponseDto;
import com.survey.universe.web.dto.auth.response.UserRegisterResponseDto;

public interface UserAuthService {

	public UserRegisterResponseDto registerUser(UserRegisterRequestDto registerDto);
	
	public UserAuthResponseDto loginUser(UserLoginRequestDto loginDto);

	public UserAuthResponseDto refreshAccessToken(TokenRefreshRequestDto refreshToken);	
}

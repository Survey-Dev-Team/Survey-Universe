package com.survey.universe.api.service;

import com.survey.universe.api.web.dto.request.RefreshRequestDto;
import com.survey.universe.api.web.dto.request.UserLoginRequestDto;
import com.survey.universe.api.web.dto.request.UserRegisterRequestDto;
import com.survey.universe.api.web.dto.response.UserLoginResponseDto;
import com.survey.universe.api.web.dto.response.UserRegisterResponseDto;

public interface UserAuthService {

	public UserRegisterResponseDto registerUser(UserRegisterRequestDto registerDto);
	
	public UserLoginResponseDto loginUser(UserLoginRequestDto loginDto);

	public UserLoginResponseDto refreshAccessToken(RefreshRequestDto refreshToken);	
}

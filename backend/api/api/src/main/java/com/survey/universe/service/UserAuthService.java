package com.survey.universe.service;

import com.survey.universe.web.dto.request.RefreshRequestDto;
import com.survey.universe.web.dto.request.UserLoginRequestDto;
import com.survey.universe.web.dto.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.response.UserLoginResponseDto;
import com.survey.universe.web.dto.response.UserRegisterResponseDto;

public interface UserAuthService {

	public UserRegisterResponseDto registerUser(UserRegisterRequestDto registerDto);
	
	public UserLoginResponseDto loginUser(UserLoginRequestDto loginDto);

	public UserLoginResponseDto refreshAccessToken(RefreshRequestDto refreshToken);	
}

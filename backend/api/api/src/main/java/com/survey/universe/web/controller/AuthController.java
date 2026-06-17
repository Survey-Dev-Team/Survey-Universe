package com.survey.universe.web.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.UserAuthService;
import com.survey.universe.web.dto.auth.request.TokenRefreshRequestDto;
import com.survey.universe.web.dto.auth.request.UserLoginRequestDto;
import com.survey.universe.web.dto.auth.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.auth.response.UserAuthResponseDto;
import com.survey.universe.web.dto.auth.response.UserRegisterResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
	
	private final UserAuthService userAuthService;
	
	
	@PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserRegisterResponseDto> registerUser(@Valid  @RequestBody UserRegisterRequestDto registerDto) {
		return ResponseEntity.ok(userAuthService.registerUser(registerDto));
	}
	
	@PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserAuthResponseDto> loginUser(@Valid  @RequestBody UserLoginRequestDto loginDto) {
		return ResponseEntity.ok(userAuthService.loginUser(loginDto));
	}
	
	@PostMapping(path = "/refresh", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserAuthResponseDto> refresh(@Valid @RequestBody TokenRefreshRequestDto refreshDto) {
	    return ResponseEntity.ok(userAuthService.refreshAccessToken(refreshDto));
	}

}

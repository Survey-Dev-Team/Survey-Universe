package com.survey.universe.web.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.UserAuthService;
import com.survey.universe.web.dto.request.RefreshRequestDto;
import com.survey.universe.web.dto.request.UserLoginRequestDto;
import com.survey.universe.web.dto.request.UserRegisterRequestDto;
import com.survey.universe.web.dto.response.UserLoginResponseDto;
import com.survey.universe.web.dto.response.UserRegisterResponseDto;

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
	public ResponseEntity<UserLoginResponseDto> loginUser(@Valid  @RequestBody UserLoginRequestDto loginDto) {
		return ResponseEntity.ok(userAuthService.loginUser(loginDto));
	}
	
	@PostMapping(path = "/refresh", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserLoginResponseDto> refresh(@Valid @RequestBody RefreshRequestDto refreshDto) {
	    return ResponseEntity.ok(userAuthService.refreshAccessToken(refreshDto));
	}

}

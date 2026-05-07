package com.survey.universe.api.web.dto.controller.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.api.service.UserAuthService;
import com.survey.universe.api.web.dto.request.RefreshRequestDto;
import com.survey.universe.api.web.dto.request.UserLoginRequestDto;
import com.survey.universe.api.web.dto.request.UserRegisterRequestDto;
import com.survey.universe.api.web.dto.response.UserLoginResponseDto;
import com.survey.universe.api.web.dto.response.UserRegisterResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
	
	private final UserAuthService userAuthService;
	
	
	@PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> registerUser(@Valid  @RequestBody UserRegisterRequestDto registerDto) {
		UserRegisterResponseDto responseDto =  userAuthService.registerUser(registerDto);
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> loginUser(@Valid  @RequestBody UserLoginRequestDto loginDto) {
		UserLoginResponseDto responseDto =  userAuthService.loginUser(loginDto);
		return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
	}
	
	@PostMapping(path = "/refresh", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequestDto refreshDto) {
		UserLoginResponseDto responseDto = userAuthService.refreshAccessToken(refreshDto);
	    return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}

}

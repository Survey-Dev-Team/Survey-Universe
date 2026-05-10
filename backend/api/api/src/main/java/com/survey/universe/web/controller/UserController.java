package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.UserFacadeService;
import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.UserPublicSummaryDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.UserUpdateRequestDto;
import com.survey.universe.web.dto.response.UserPrivateResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
	
	private final UserFacadeService userService;
	
	@GetMapping(path = "/{urlId}/public", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserPublicSummaryDto> getPublicUserByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(userService.getPublicUserByUrlId(urlId));
	} 
	
	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #urlId)")
	public ResponseEntity<UserPrivateResponseDto> getPrivateUserByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(userService.getPrivateUserByUrlId(urlId));
	} 
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<UserPrivateResponseDto>> getUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}
	
	@PutMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #urlId)")
	public ResponseEntity<UserPrivateResponseDto> updateUser(@PathVariable String urlId, @Valid @RequestBody UserUpdateRequestDto updateRequest) {
		return ResponseEntity.ok(userService.updateUserByUrlId(urlId, updateRequest));
	}
	
	@DeleteMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #urlId)")
	public ResponseEntity<MessageDto> deleteUser(@PathVariable String urlId) {
		return ResponseEntity.ok(userService.deleteUserByUrlId(urlId));
	} 
	
	
	@GetMapping("/{urlId}/responses")
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #urlId)")
	public ResponseEntity<List<UserSurveyResponseDto>> getUserResponses(@PathVariable String urlId) {
	    return ResponseEntity.ok(userService.getUserResponses(urlId));
	}

}

package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.UserFacadeService;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.UsersSortOption;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;
import com.survey.universe.web.dto.user.UserPrivateDetailsResponseDto;
import com.survey.universe.web.dto.user.UserPublicSummaryDto;
import com.survey.universe.web.dto.user.UserUpdateRequestDto;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
	public ResponseEntity<UserPrivateDetailsResponseDto> getPrivateUserByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(userService.getPrivateUserByUrlId(urlId));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiResponse(responseCode = "200", description = "Returns list of users based on parameters, content field schema - UserPrivateDetailsResponseDto", content = @Content(mediaType = "application/json", schema = @Schema(implementation = PagedResponseDto.class, subTypes = {
			UserPrivateDetailsResponseDto.class })))
	public ResponseEntity<PagedResponseDto<UserPrivateDetailsResponseDto>> getUsers(
			@RequestParam(required = false) String search,
			@Parameter(description = "Filtration by isDeleted field for admin: "
					+ "true — show both deleted and active, "
					+ "false — show only active", example = "false") @RequestParam(defaultValue = "false") Boolean showDeleted,
			@RequestParam(defaultValue = "lastSession") UsersSortOption sortBy,
			@RequestParam(defaultValue = "0") Integer page,
			@Parameter(description = "Size of a page for pagination options, if 0, return all users, else, paginated") @RequestParam(defaultValue = "0") Integer size) {
		return ResponseEntity.ok(userService.getAllUsers(search, showDeleted, sortBy, page, size));
	}

	@PutMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #urlId)")
	public ResponseEntity<UserPrivateDetailsResponseDto> updateUser(@PathVariable String urlId,
			@Valid @RequestBody UserUpdateRequestDto updateRequest) {
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

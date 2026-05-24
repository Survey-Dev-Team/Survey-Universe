package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.SurveyResponseFacadeService;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.inheritable.ConditionalResponseDto;
import com.survey.universe.web.dto.request.SurveyResponseSubmitDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyResponseController {

	private SurveyResponseFacadeService responseService;

	@GetMapping(path = "/{surveyUrlId}/responses/{userUrlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #userUrlId)")
	public ResponseEntity<PersonalSurveyResponseDto> getUserResponse(@PathVariable String surveyUrlId,
			@PathVariable String userUrlId) {
		return ResponseEntity.ok(responseService.getUserResponse(surveyUrlId, userUrlId));
	}

	@PostMapping(path = "/{urlId}/responses", produces = MediaType.APPLICATION_JSON_VALUE)
	@Operation(summary = "DTO response depends on whether the survey is a test")
	@ApiResponse(responseCode = "200", description = "On success code, return PersonalSurveyResponseDto for Surveys that are tests, and MessageDto else)", content = @Content(mediaType = "application/json", schema = @Schema(oneOf = {
			MessageDto.class, PersonalSurveyResponseDto.class })))
	public ResponseEntity<ConditionalResponseDto> submitResponse(@PathVariable String urlId,
			@Valid @RequestBody SurveyResponseSubmitDto submitDto) {
		return ResponseEntity.ok(responseService.submitResponse(urlId, submitDto));
	}

	@GetMapping(path = "/{urlId}/responses", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<UserSurveyResponseDto>> getResponses(@PathVariable String urlId) {
		return ResponseEntity.ok(responseService.getResponses(urlId));
	}

	@GetMapping(path = "/{urlId}/stats", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<SurveyStatsDto> getStats(@PathVariable String urlId) {
		return ResponseEntity.ok(responseService.getSurveyStats(urlId));
	}

	@GetMapping(path = "/stats", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SurveyStatsDto>> getStats(@RequestParam String category, @RequestParam(required = false) TimeRange timeRange) {
		return ResponseEntity.ok(responseService.filterSurveyStats(category, timeRange));
	}
}

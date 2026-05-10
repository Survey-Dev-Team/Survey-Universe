package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.SurveyResponseFacadeService;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.SurveySubmitDto;
import com.survey.universe.web.dto.response.PersonalSurveyResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyResponseController {

	private SurveyResponseFacadeService responseService;

	@GetMapping(path = "/{surveyUrlId}/responses/{userUrlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #userUrlId)")
	public ResponseEntity<PersonalSurveyResponseDto> getUserResponse(@PathVariable String surveyUrlId, @PathVariable String userUrlId) {
		return ResponseEntity.ok(responseService.getUserResponse(surveyUrlId, userUrlId));
	}
	
	@PostMapping(path = "/{urlId}/responses", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<PersonalSurveyResponseDto> submitResponse(@PathVariable String urlId,
			@Valid @RequestBody SurveySubmitDto submitDto) {
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
}

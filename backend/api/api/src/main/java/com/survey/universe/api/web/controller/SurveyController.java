package com.survey.universe.api.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.api.service.SurveyFacadeService;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyStatsDto;
import com.survey.universe.api.web.dto.SurveySummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/survey")
@AllArgsConstructor
public class SurveyController {

	private SurveyFacadeService surveyService;

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SurveySummaryDto>> getAvailableSurveys() {
		return ResponseEntity.ok(surveyService.getAllSurveys());
	}

	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<SurveyResponseDto> getSurveyByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.getSurveyByUrlId(urlId));
	}

	@GetMapping
	public ResponseEntity<PagedResponseDto<SurveySummaryDto>> getSurveys(@RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String status, @RequestParam(required = false) String search,
			@RequestParam(required = false) String creator) {
		return ResponseEntity.ok(surveyService.getFilteredSurveys(page, size, category, status, search, creator));
	}

	@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyResponseDto> addSurvey(@RequestBody SurveyCreateRequestDto surveyCreateDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(surveyService.createSurvey(surveyCreateDto));
	}

	@PutMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyResponseDto> updateSurvey(@PathVariable String urlId,
			@RequestBody SurveyUpdateRequestDto surveyUpdateDto) {
		return ResponseEntity.ok(surveyService.updateSurvey(urlId, surveyUpdateDto));
	}

	@DeleteMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MessageDto> deleteSurvey(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.deleteSurvey(urlId));
	}

	
	@PostMapping("/{urlId}/responses")
	public ResponseEntity<MessageDto> submitResponse(
	        @PathVariable String urlId,
	        @Valid @RequestBody SurveySubmitDto submitDto) {
	    return ResponseEntity.ok(surveyService.submitResponse(urlId, submitDto));
	}
	
	@GetMapping("/{urlId}/responses")
	public ResponseEntity<List<UserSurveyResponseDto>> getResponses(@PathVariable String urlId) {
	    return ResponseEntity.ok(surveyService.getResponses(urlId));
	}

	@GetMapping("/{urlId}/stats")
	public ResponseEntity<SurveyStatsDto> getStats(@PathVariable String urlId) {
	    return ResponseEntity.ok(surveyService.getSurveyStats(urlId));
	}

}

package com.survey.universe.api.web.controller;

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

import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.service.SurveyAdminFacadeService;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyAdminSummaryDto;
import com.survey.universe.api.web.dto.request.SurveyCreateRequestDto;
import com.survey.universe.api.web.dto.request.SurveyUpdateRequestDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyAdminResponseDto;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys/admin")
@AllArgsConstructor
public class SurveyAdminController {

	private SurveyAdminFacadeService surveyService;

	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyAdminResponseDto> getSurveyByAdminUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.getAdminSurveyByUrlId(urlId));
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<PagedResponseDto<SurveyAdminSummaryDto>> getAdminSurveys(
			@RequestParam(required = false) String status, @RequestParam(required = false) String creator,
			@RequestParam(required = false) String search, @RequestParam(required = false) String category,
			@RequestParam(required = false) Boolean showDeleted,
			@RequestParam(defaultValue = "newest") SortOption sortby,
			@RequestParam(required = false) TimeRange timeRange,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return ResponseEntity
				.ok(surveyService.getAdminFilteredSurveys(status, creator, search, category, sortby, timeRange, showDeleted, page, size));
	}

	@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyAdminResponseDto> addSurvey(@RequestBody SurveyCreateRequestDto surveyCreateDto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(surveyService.createSurvey(surveyCreateDto));
	}

	@PutMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyAdminResponseDto> updateSurvey(@PathVariable String urlId,
			@RequestBody SurveyUpdateRequestDto surveyUpdateDto) {
		return ResponseEntity.ok(surveyService.updateSurvey(urlId, surveyUpdateDto));
	}

	@DeleteMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MessageDto> deleteSurvey(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.deleteSurvey(urlId));
	}

}

package com.survey.universe.api.web.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.api.persistence.constant.SortOption;
import com.survey.universe.api.persistence.constant.TimeRange;
import com.survey.universe.api.service.SurveyFacadeService;
import com.survey.universe.api.web.dto.MessageDto;
import com.survey.universe.api.web.dto.SurveyStatsDto;
import com.survey.universe.api.web.dto.SurveySummaryDto;
import com.survey.universe.api.web.dto.UserSurveyResponseDto;
import com.survey.universe.api.web.dto.request.SurveySubmitDto;
import com.survey.universe.api.web.dto.response.PagedResponseDto;
import com.survey.universe.api.web.dto.response.SurveyResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyUserController {

	private SurveyFacadeService surveyService;

	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<SurveyResponseDto> getSurveyByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.getSurveyByUrlId(urlId));
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<PagedResponseDto<SurveySummaryDto>> getAvailableSurveys(
			@RequestParam(required = false) String category, @RequestParam(required = false) String search,
			@RequestParam(required = false) String creator,
			@RequestParam(defaultValue = "newest") SortOption sortBy,
			@RequestParam(required = false) TimeRange timeRange,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(surveyService.getFilteredSurveys(category, search, creator, sortBy, timeRange, page, size));
	}

	@PostMapping("/{urlId}/responses")
	public ResponseEntity<MessageDto> submitResponse(@PathVariable String urlId,
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

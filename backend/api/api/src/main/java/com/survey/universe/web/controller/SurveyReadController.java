package com.survey.universe.web.controller;

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

import com.survey.universe.service.SurveyReadFacadeService;
import com.survey.universe.service.constant.SortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.MessageDto;
import com.survey.universe.web.dto.SurveyStatsDto;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.UserSurveyResponseDto;
import com.survey.universe.web.dto.request.SurveySubmitDto;
import com.survey.universe.web.dto.response.PagedResponseDto;
import com.survey.universe.web.dto.response.SurveyReadResponseDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyReadController {

	private SurveyReadFacadeService surveyService;

	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<SurveyReadResponseDto> getSurveyByUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.getSurveyByUrlId(urlId));
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<PagedResponseDto<SurveyReadSummaryDto>> getAvailableSurveys(
			@RequestParam(required = false) String category, @RequestParam(required = false) String search,
			@RequestParam(required = false) String creator,
			@RequestParam(defaultValue = "newest") SortOption sortBy,
			@RequestParam(required = false) TimeRange timeRange,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(surveyService.getFilteredSurveys(category, search, creator, sortBy, timeRange, page, size));
	}

	
}

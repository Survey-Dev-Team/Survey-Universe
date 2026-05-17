package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.service.SurveyReadFacadeService;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyReadSummaryDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyReadResponseDto;

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
			@RequestParam(required = false) SurveyStatus surveyStatus,
			@RequestParam(required = false) SurveyType surveyType, @RequestParam(required = false) String category,
			@RequestParam(required = false) String search, @RequestParam(required = false) String creator,
			@RequestParam(defaultValue = "newest") SurveySortOption sortBy,
			@RequestParam(required = false) TimeRange timeRange, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "0") int size) {
		return ResponseEntity.ok(surveyService.getFilteredSurveys(surveyStatus, surveyType, category, search, creator,
				sortBy, timeRange, page, size));
	}

	@GetMapping(path = "/home", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<SurveyReadSummaryDto>> getHomeSurveys() {
		return ResponseEntity.ok(surveyService.getHomeSurveys());
	}

}

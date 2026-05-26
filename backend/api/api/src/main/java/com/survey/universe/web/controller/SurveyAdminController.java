package com.survey.universe.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.domain.constant.SurveyStatus;
import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.service.SurveyDetailsFacadeService;
import com.survey.universe.service.constant.SurveySortOption;
import com.survey.universe.service.constant.TimeRange;
import com.survey.universe.web.dto.SurveyDetailsSummaryDto;
import com.survey.universe.web.dto.auth.request.SurveyHomePatchDto;
import com.survey.universe.web.dto.generic.MessageDto;
import com.survey.universe.web.dto.generic.PagedResponseDto;
import com.survey.universe.web.dto.generic.RevisionMessageDto;
import com.survey.universe.web.dto.generic.RevisionRecordDto;
import com.survey.universe.web.dto.request.survey.AdminSurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyCreateRequestDto;
import com.survey.universe.web.dto.request.survey.SurveyDetailsResponseDto;
import com.survey.universe.web.dto.request.survey.SurveyUpdateRequestDto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys/admin")
@AllArgsConstructor
public class SurveyAdminController {

	private SurveyDetailsFacadeService surveyService;

	@GetMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyDetailsResponseDto> getSurveyByAdminUrlId(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.getSurveyByUrlId(urlId));
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<PagedResponseDto<SurveyDetailsSummaryDto>> getAdminSurveys(
			@RequestParam(required = false) SurveyType surveyType,
			@RequestParam(required = false) SurveyStatus surveyStatus, @RequestParam(required = false) String creator,
			@RequestParam(required = false) String search, @RequestParam(required = false) String category,
			@RequestParam(defaultValue = "false") Boolean showDeleted,
			@RequestParam(defaultValue = "newest") SurveySortOption sortby,
			@RequestParam(required = false) TimeRange timeRange, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "0") int size) {
		return ResponseEntity.ok(surveyService.getFilteredSurveys(surveyType, surveyStatus, creator, search, category,
				sortby, timeRange, showDeleted, page, size));
	}

	@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyDetailsResponseDto> createSurvey(
	        @Valid @RequestBody SurveyCreateRequestDto surveyCreateDto) {
	    return ResponseEntity.status(HttpStatus.CREATED).body(surveyService.createSurvey(surveyCreateDto));
	}


	@PutMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<SurveyDetailsResponseDto> updateSurvey(@PathVariable String urlId,
			@RequestBody SurveyUpdateRequestDto surveyUpdateDto) {
		return ResponseEntity.ok(surveyService.updateSurvey(urlId, surveyUpdateDto));
	}

	@DeleteMapping(path = "/{urlId}", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MessageDto> deleteSurvey(@PathVariable String urlId) {
		return ResponseEntity.ok(surveyService.deleteSurvey(urlId));
	}

	@PostMapping(path = "/{urlId}/publish", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<RevisionMessageDto> publishSurvey(@PathVariable String urlId,
			@Valid @RequestBody RevisionRecordDto revision) {
		return ResponseEntity.ok(surveyService.publishSurvey(urlId, revision));
	}

	@PostMapping(path = "/{urlId}/close", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<RevisionMessageDto> closeSurvey(@PathVariable String urlId,
			@Valid @RequestBody RevisionRecordDto revision) {
		return ResponseEntity.ok(surveyService.closeSurvey(urlId, revision));
	}

	@PostMapping(path = "/{urlId}/draft", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<RevisionMessageDto> draftSurvey(@PathVariable String urlId,
			@Valid @RequestBody RevisionRecordDto revision) {
		return ResponseEntity.ok(surveyService.draftSurvey(urlId, revision));
	}

	@PatchMapping(path = "/{urlId}/home", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<RevisionMessageDto> setHome(@PathVariable String urlId,
			@RequestBody SurveyHomePatchDto homePatchDto) {
		return ResponseEntity.ok(surveyService.setHome(urlId, homePatchDto));
	}
}

package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.stub.UserAggregationService;
import com.survey.universe.web.dto.aggregation.ActiveAssessmentCardDto;
import com.survey.universe.web.dto.aggregation.ActiveAssessmentsDashboardDto;
import com.survey.universe.web.dto.aggregation.UserCompletedTestCardDto;
import com.survey.universe.web.dto.aggregation.UserCreatedSurveyCardDto;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/aggregation/surveys/public")
@AllArgsConstructor
public class UserAggregationController {

	private UserAggregationService statsService;

	@GetMapping("/active")
	public ResponseEntity<ActiveAssessmentsDashboardDto> getActiveAssessmentsOverview() {
		return ResponseEntity.ok(statsService.getActiveAssessmentsForUsers());
	}

	@GetMapping("/my")
	public ResponseEntity<List<UserCreatedSurveyCardDto>> getCreatedSurveysOverview() {
		return ResponseEntity.ok(statsService.getCreatedSurveyAssessment());
	}

	@GetMapping("/complete")
	public ResponseEntity<List<UserCompletedTestCardDto>> getCompletedTestsOverview() {
		return ResponseEntity.ok(statsService.getUserPersonalAssessments());
	}

	@GetMapping("/{urlId}/details")
	public ResponseEntity<ActiveAssessmentCardDto> getAssessmentDetail(@PathVariable String urlId) {
		return ResponseEntity.ok(statsService.getAssessmentDetail(urlId));
	}

}

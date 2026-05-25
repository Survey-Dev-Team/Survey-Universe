package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.stub.OverviewStatsService;
import com.survey.universe.web.dto.aggregation.ActivityMetricsDto;
import com.survey.universe.web.dto.aggregation.OverviewStatsDto;
import com.survey.universe.web.dto.aggregation.SurveyTableItemDto;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/aggregation/surveys")
@AllArgsConstructor
public class SurveyResponseAdminAggregationController {

    private final OverviewStatsService statsService;

    @GetMapping("/overview")
    public ResponseEntity<OverviewStatsDto> getOverview(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getOverviewStatistics(range));
    }

    @GetMapping("/activity")
    public ResponseEntity<ActivityMetricsDto> getActivity(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getActivityMetrics(range));
    }
    
    @GetMapping("/table")
    public ResponseEntity<List<SurveyTableItemDto>> getSurveysTable(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getSurveyTableMetrics(range));
    }
}

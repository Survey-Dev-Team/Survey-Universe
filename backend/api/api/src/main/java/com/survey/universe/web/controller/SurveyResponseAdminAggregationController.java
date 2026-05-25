package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.domain.constant.SurveyType;
import com.survey.universe.service.stub.OverviewStatsService;
import com.survey.universe.web.dto.aggregation.ActivityMetricsDto;
import com.survey.universe.web.dto.aggregation.OverviewStatsDto;
import com.survey.universe.web.dto.aggregation.SurveyTableItemDto;
import com.survey.universe.web.dto.aggregation.TestDashboardOverviewDto;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/surveys/admin/overview")
@AllArgsConstructor
public class SurveyResponseAdminAggregationController {

	private final OverviewStatsService statsService;

    @GetMapping("/overview")
    public ResponseEntity<OverviewStatsDto> getOverview() {
        return ResponseEntity.ok(statsService.getOverviewStatistics());
    }
    

    @GetMapping("/activity")
    public ResponseEntity<ActivityMetricsDto> getActivity() {
        return ResponseEntity.ok(statsService.getActivityMetrics());
    }
    
    @GetMapping("/table")
    public ResponseEntity<List<SurveyTableItemDto>> getSurveysTable() {
        return ResponseEntity.ok(statsService.getSurveyTableMetrics());
    }
    
    
    
    @GetMapping("/funnel/{type}")
    public ResponseEntity<CompletionFunneltp> getFunnel(
            @PathVariable("type") String typeString,
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        
        SurveyType type;
        try {
            type = SurveyType.valueOf(typeString.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(funnelService.getCompletionFunnel(type, range));
    }
    
    @GetMapping("/overview/{type}")
    public ResponseEntity<TestDashboardOverviewDto> getOverview(
            @PathVariable("type") String typeString,
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        
        SurveyType type;
        try {
            type = SurveyType.valueOf(typeString.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Blocks illegal types
        }

        TestDashboardOverviewDto metrics = statsService.getOverviewMetrics(type, range);
        return ResponseEntity.ok(metrics);
    }
}
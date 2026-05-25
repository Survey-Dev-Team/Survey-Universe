package com.survey.universe.web.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.survey.universe.service.stub.OverviewTestsStatsService;
import com.survey.universe.web.dto.aggregation.PerformanceAnalysisDto;
import com.survey.universe.web.dto.aggregation.TestDashboardOverviewDto;
import com.survey.universe.web.dto.aggregation.TestSummaryDto;
import com.survey.universe.web.dto.generic.CompletionFunnelDto;

import java.util.List;

@RestController
@RequestMapping("/aggregation/tests")
@AllArgsConstructor
public class TestResponseAdminAggregationController {

    private final OverviewTestsStatsService statsService;

    @GetMapping("/funnel")
    public ResponseEntity<CompletionFunnelDto> getFunnel(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getCompletionFunnel(range));
    }
    
    @GetMapping("/overview")
    public ResponseEntity<TestDashboardOverviewDto> getOverview(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {         
        return ResponseEntity.ok(statsService.getOverviewMetrics(range));
    }
    
    @GetMapping("/performance")
    public ResponseEntity<PerformanceAnalysisDto> retrieveDashboardData(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getPerformanceAnalysis(range));
    }
    
    @GetMapping("/table")
    public ResponseEntity<List<TestSummaryDto>> getTestsTableSummary(
            @RequestParam(value = "range", required = false, defaultValue = "all") String range) {
        return ResponseEntity.ok(statsService.getTestsTableSummary(range));
    }
}

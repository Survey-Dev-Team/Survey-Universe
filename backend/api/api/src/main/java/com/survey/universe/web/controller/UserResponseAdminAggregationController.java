package com.survey.universe.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.survey.universe.service.stub.OverviewUsersStatsService;
import com.survey.universe.web.dto.aggregation.UserReportDto;
import com.survey.universe.web.dto.aggregation.UserTableSummaryDto;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/aggregation/users")
@AllArgsConstructor
public class UserResponseAdminAggregationController {

	private final OverviewUsersStatsService statsService;

	
	@GetMapping("/summary")
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserTableSummaryDto>> getUsersTableSummary() {
        return ResponseEntity.ok(statsService.getUsersTableSummary());
    }

    @GetMapping("/{userId}/report")
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserReportDto> getUserReport(@PathVariable String userId) {
        return ResponseEntity.ok(statsService.getUserActivityReport(userId));
    }
}

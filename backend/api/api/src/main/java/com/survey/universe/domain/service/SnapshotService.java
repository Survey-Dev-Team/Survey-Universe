package com.survey.universe.domain.service;

import org.springframework.stereotype.Component;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.model.UserResponseStatsSnapshot;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.exception.type.InternalConflictException;
import com.survey.universe.mapper.ResponseToStatsSnapshotMapper;
import com.survey.universe.service.stub.StubSurveyResponseSnapshotService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class SnapshotService {

	private UUIDGenerator uuidGenerator;
	private ResponseToStatsSnapshotMapper toStats;
	private StubSurveyResponseSnapshotService statsService;

	
	public  UserResponseStatsSnapshot attemptSnapshot(SurveyResponse response, Survey survey) {

		UserResponseStatsSnapshot snapshot = toStats.toStatsSnapshots(response, survey, survey.getSlugId(),
				DocType.SNAPSHOT.join(uuidGenerator.generateUUIDv7()));

		snapshot = statsService.add(snapshot)
				.orElseThrow(() -> new InternalConflictException("Could not record stats for submitted survey"));
		return snapshot;
	}
}

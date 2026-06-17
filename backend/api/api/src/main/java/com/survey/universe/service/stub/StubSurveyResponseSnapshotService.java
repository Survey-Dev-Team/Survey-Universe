package com.survey.universe.service.stub;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.UserResponseStatsSnapshot;
import com.survey.universe.domain.stub.storage.StubResponseSnapshotStorage;
import com.survey.universe.service.SurveyResponseSnapshotService;

import lombok.AllArgsConstructor;

@Component
@Profile("test")
@AllArgsConstructor
public class StubSurveyResponseSnapshotService implements SurveyResponseSnapshotService {

	private final StubResponseSnapshotStorage snapshots;
	
	@Override
	public Optional<UserResponseStatsSnapshot> add(UserResponseStatsSnapshot snapshot) {
		if (findByResponse(snapshot.getResponseId()).isPresent()) {
			return Optional.empty();
		}
		snapshot.setRevision("1-stub");
		snapshots.add(snapshot); 
		return Optional.of(snapshot);		
	}

	@Override
	public Optional<UserResponseStatsSnapshot> findByResponse(String responseId) {
		return snapshots.findByResponse(responseId);
	}

	@Override
	public UserResponseStatsSnapshot delete(UserResponseStatsSnapshot snapshot) {
		return snapshots.delete(snapshot);
	}

	@Override
	public List<UserResponseStatsSnapshot> findByUser(String userId) {
		return snapshots.findByUser(userId);
	}

	@Override
	public List<UserResponseStatsSnapshot> findBySurvey(String surveyId) {
		return snapshots.findBySurvey(surveyId);
	}
}


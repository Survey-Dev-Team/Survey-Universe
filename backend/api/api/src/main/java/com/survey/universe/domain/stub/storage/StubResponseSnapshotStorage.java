package com.survey.universe.domain.stub.storage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.UserResponseStatsSnapshot;

@Component
@Profile("test")
public class StubResponseSnapshotStorage {
	
	private Map<String, UserResponseStatsSnapshot> snapshots = new HashMap<>();
	
	public UserResponseStatsSnapshot add(UserResponseStatsSnapshot snapshot) {
		snapshots.put(snapshot.getResponseId(), snapshot);
		return snapshot;
		
	}

	public Optional<UserResponseStatsSnapshot> findByResponse(String responseId) {
		return Optional.ofNullable(snapshots.get(responseId));
	}
	
	public UserResponseStatsSnapshot delete(UserResponseStatsSnapshot snapshot) {
		snapshots.remove(snapshot.getResponseId());
		return snapshot;
	}
	
	public List<UserResponseStatsSnapshot> findByUser(String userId) {
		return snapshots.values().stream().filter(s -> s.getUserId().equals(userId)).toList();
	}
	
	public List<UserResponseStatsSnapshot> findBySurvey(String surveyId) {
		return snapshots.values().stream().filter(s -> s.getSurveyId().equals(surveyId)).toList();
	}
}

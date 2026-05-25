package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.UserResponseStatsSnapshot;
import com.survey.universe.domain.repository.CouchDbResponseSnapshotRepository;
import com.survey.universe.service.SurveyResponseSnapshotService;

import java.util.List;
import java.util.Optional;

@Service
@Primary
@AllArgsConstructor
public class CouchDbSurveyResponseSnapshotService implements SurveyResponseSnapshotService {

    private final CouchDbResponseSnapshotRepository repository;

    @Override
    public Optional<UserResponseStatsSnapshot> add(UserResponseStatsSnapshot snapshot) {
        if (findByResponse(snapshot.getResponseId()).isPresent()) {
            return Optional.empty();
        }
        
        snapshot.setRevision(null);
        return Optional.of(repository.save(snapshot));
    }

    @Override
    public Optional<UserResponseStatsSnapshot> findByResponse(String responseId) {
        return repository.findById(responseId);
    }

    @Override
    public UserResponseStatsSnapshot delete(UserResponseStatsSnapshot snapshot) {
        repository.delete(snapshot);
        return snapshot;
    }

    @Override
    public List<UserResponseStatsSnapshot> findByUser(String userId) {
        return repository.findAllByField("user_id", userId);
    }

    @Override
    public List<UserResponseStatsSnapshot> findBySurvey(String surveyId) {
        return repository.findAllByField("survey_id", surveyId);
    }
}

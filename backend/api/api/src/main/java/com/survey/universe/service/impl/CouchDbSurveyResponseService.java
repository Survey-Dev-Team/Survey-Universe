package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.repository.CouchDbSurveyResponseRepository;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Primary
@AllArgsConstructor
public class CouchDbSurveyResponseService implements SurveyResponseService {

    private final CouchDbSurveyResponseRepository repository;
	private final UUIDGenerator uuidGenerator;

    @Override
    public Optional<SurveyResponse> add(SurveyResponse response) {
        if (response.getId() != null && !response.getId().isBlank()) {
            Optional<SurveyResponse> responseCandidate = repository.findById(response.getId());
            
            if (responseCandidate.isPresent()) {
                SurveyResponse oldResponse = responseCandidate.get();
                if (Boolean.TRUE.equals(oldResponse.getIsComplete())) {
                    return Optional.empty();
                }
                
                response.setRevision(oldResponse.getRevision());
            }
        } else {
            response.setId(DocType.SURVEY.join(uuidGenerator.generateUUIDv7()));
            response.setRevision(null);
        }

        response.setSubmittedAt(Instant.now());
        
        return repository.save(response);
    }

    @Override
    public List<SurveyResponse> findAllBySurveyId(String surveyId) {
        return repository.findAllByField("survey_id", surveyId);
    }

    @Override
    public Optional<SurveyResponse> findByResponseId(String id) {
        return repository.findById(id);
    }

    @Override
    public List<SurveyResponse> findAllByRespondentId(String respondentId) {
        return repository.findAllByField("respondent_id", respondentId);
    }

    @Override
    public List<SurveyResponse> getAll() {
        return repository.getAll();
    }
}

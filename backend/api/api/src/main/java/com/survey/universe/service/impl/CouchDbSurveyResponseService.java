package com.survey.universe.service.impl;

import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.ibm.cloud.cloudant.v1.model.FindResult;
import com.ibm.cloud.cloudant.v1.model.PostFindOptions;
import com.survey.universe.domain.constant.DocType;
import com.survey.universe.domain.model.SurveyResponse;
import com.survey.universe.domain.repository.CouchDbSurveyResponseRepository;
import com.survey.universe.service.SurveyResponseService;
import com.survey.universe.spring.configuration.bean.UUIDGenerator;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Primary
@AllArgsConstructor
public class CouchDbSurveyResponseService implements SurveyResponseService {

	private final CouchDbSurveyResponseRepository repository;
	private final UUIDGenerator uuidGenerator;

	@Override
	public Optional<SurveyResponse> add(SurveyResponse response) {
		if (response.getRespondentId() == null || response.getRespondentId().isBlank()
				|| "anonymousUser".equals(response.getRespondentId())) {
			System.err.println("CouchDB Error: Спроба надіслати відповідь без валідного токена користувача!");
			return Optional.empty();
		}

		List<SurveyResponse> existingResponses = repository.findBySurveyAndRespondent(response.getSurveyId(),
				response.getRespondentId());

		if (!existingResponses.isEmpty()) {
			SurveyResponse existingResponse = existingResponses.get(0);

			if (Boolean.TRUE.equals(existingResponse.getIsComplete())) {
				System.out.println("CouchDB: Користувач " + response.getRespondentId()
						+ " вже має завершену відповідь для " + response.getSurveyId());
				return Optional.empty();
			}

			response.setId(existingResponse.getId());
			response.setRevision(existingResponse.getRevision());
		} else {
			response.setId("response:" + java.util.UUID.randomUUID().toString());
			response.setRevision(null);
		}

		response.setSubmittedAt(Instant.now());
		response.setRootType("response");

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

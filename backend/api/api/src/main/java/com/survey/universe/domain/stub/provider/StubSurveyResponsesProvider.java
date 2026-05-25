package com.survey.universe.domain.stub.provider;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.survey.universe.domain.model.SurveyResponse;

@Component
@Profile("test")
public class StubSurveyResponsesProvider {

	private final List<SurveyResponse> stubResponses;

	public StubSurveyResponsesProvider(ObjectMapper mapper) {
		mapper.findAndRegisterModules();

		try (InputStream is = getClass().getResourceAsStream("/stub/responses.json")) {
			this.stubResponses = mapper.readValue(is, new TypeReference<List<SurveyResponse>>() {
			});
		} catch (IOException e) {
			throw new RuntimeException("Не вдалося завантажити стіби користувачів", e);
		}
		
		for (SurveyResponse response : stubResponses) {
			response.setIsComplete(true);
		}
	}

	public List<SurveyResponse> getAll() {
		return stubResponses;
	}

	public SurveyResponse getById(String id) {
		return stubResponses.stream().filter(u -> u.getId().equals(id)).findFirst().orElse(null);
	}
}

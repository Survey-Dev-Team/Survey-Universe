package com.survey.universe.domain.stub.provider;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.survey.universe.domain.model.survey.Survey;

@Component
@Profile("test")
public class StubSurveysProvider {

	private final List<Survey> stubSurveys;

	public StubSurveysProvider(ObjectMapper mapper) {
		mapper.findAndRegisterModules();

		try (InputStream is = getClass().getResourceAsStream("/stub/surveys.json")) {
			this.stubSurveys = mapper.readValue(is, new TypeReference<List<Survey>>() {
			});
		} catch (IOException e) {
			throw new RuntimeException("Не вдалося завантажити стіби користувачів", e);
		}
	}

	public List<Survey> getAll() {
		return stubSurveys;
	}

	public Survey getById(String id) {
		return stubSurveys.stream().filter(u -> u.getId().equals(id)).findFirst().orElse(null);
	}
}

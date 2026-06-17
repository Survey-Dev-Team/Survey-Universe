package com.survey.universe.domain.stub.provider;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.survey.universe.domain.model.User;

@Component
@Profile("test")
public class StubUsersProvider {

	private final List<User> stubUsers;

	public StubUsersProvider(ObjectMapper mapper) {
		mapper.findAndRegisterModules();

		try (InputStream is = getClass().getResourceAsStream("/stub/users.json")) {
			this.stubUsers = mapper.readValue(is, new TypeReference<List<User>>() {
			});
		} catch (IOException e) {
			throw new RuntimeException("Не вдалося завантажити стіби користувачів", e);
		}
	}

	public List<User> getAll() {
		return stubUsers;
	}

	public User getById(String id) {
		return stubUsers.stream().filter(u -> u.getId().equals(id)).findFirst().orElse(null);
	}

}

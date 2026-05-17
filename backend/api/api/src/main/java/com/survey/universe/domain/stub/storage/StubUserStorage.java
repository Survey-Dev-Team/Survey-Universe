package com.survey.universe.domain.stub.storage;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.survey.universe.domain.model.User;

@Component
@Profile("test")
public class StubUserStorage {

	private final Map<String, User> userStorage = new HashMap<>();

	public User add(String email, User user) {
		userStorage.put(email, user);
		return user;
	}

	public User update(String email, User user) {
		return add(email, user);
	}

	public Optional<User> findByEmail(String email) {
		return Optional.ofNullable(userStorage.get(email));
	}

	public Optional<User> findById(String id) {
		Collection<User> users = userStorage.values();
		for (User user : users) {
			if (user.getId().equals(id)) {
				return Optional.of(user);
			}
		}
		return Optional.empty();
	}
	
	public List<User> getAll() {
		return userStorage.values().stream().toList();
	}

}

package com.survey.universe.api.persistence.stub;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.survey.universe.api.persistence.entity.User;

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
	
}

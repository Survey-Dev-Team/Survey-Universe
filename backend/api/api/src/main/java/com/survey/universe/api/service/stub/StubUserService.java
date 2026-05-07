package com.survey.universe.api.service.stub;

import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.api.persistence.entity.User;
import com.survey.universe.api.persistence.stub.StubUserStorage;
import com.survey.universe.api.service.UserService;

import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubUserService implements UserService{


	private final StubUserStorage users;
	
	@Override
	public Optional<User> findByEmail(String email) {
		return users.findByEmail(email);
	}
	
	@Override
	public Optional<User> add(User user) {
		String email = user.getEmail();
		if (findByEmail(email).isPresent()) {
			return Optional.empty();
		}
		users.add(email, user);
		return Optional.of(user);
	}

	@Override
	public Optional<User> update(User user) {
		String email = user.getEmail();
		Optional<User> foundUser = users.findByEmail(email);
		if (foundUser.isEmpty()) {
			return Optional.empty();
		}
		users.update(email, user);
		return Optional.of(user);
	}
	
}

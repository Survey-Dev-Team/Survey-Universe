package com.survey.universe.service.stub;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.survey.universe.domain.model.User;
import com.survey.universe.domain.model.survey.Survey;
import com.survey.universe.domain.stub.provider.StubUsersProvider;
import com.survey.universe.domain.stub.storage.StubUserStorage;
import com.survey.universe.service.UserService;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;

@Service
@Profile("test")
@AllArgsConstructor
public class StubUserService implements UserService {

	private final StubUserStorage users;

	private final StubUsersProvider provider;

	@PostConstruct
	private void init() {
		for (User user : provider.getAll()) {
			add(user);
		}
	}

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
		user.setRevision("1-stub");
		users.add(email, user);
		return Optional.of(user);
	}

	@Override
	public Optional<User> update(User user) {
		String email = user.getEmail();
		Optional<User> foundUser = users.findByEmail(email);
		if (foundUser.isEmpty()) {
			System.out.println("here");
			return Optional.empty();
		}
		String currentRev = user.getRevision();
		int revNum = currentRev != null && currentRev.contains("-") ? Integer.parseInt(currentRev.split("-")[0]) : 0;
		user.setRevision((revNum + 1) + "-stub");
		users.update(email, user);
		return Optional.of(user);
	}

	@Override
	public Optional<User> findById(String id) {
		return users.findById(id);
	}

	@Override
	public List<User> getAll() {
		return users.getAll();
	}

	@Override
	public List<User> filter(String search, Boolean showDeleted) {
		return getAll().stream().filter(u -> u.isDeleted() == false || u.isDeleted() == showDeleted)
				.filter(s -> search == null || containsSearchTerm(s, search)).toList();
	}

	private boolean containsSearchTerm(User u, String term) {
		String lowerTerm = term.toLowerCase();
		return u.getFirstName().toLowerCase().contains(lowerTerm) || u.getLastName().toLowerCase().contains(lowerTerm)
				|| u.getEmail().toLowerCase().contains(lowerTerm);
	}

}

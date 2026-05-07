package com.survey.universe.api.service;

import java.util.Optional;

import com.survey.universe.api.persistence.entity.User;

public interface UserService {
	
	public Optional<User> findByEmail(String email);
	
	public Optional<User> add(User user);
	
	public Optional<User> update(User user);

}

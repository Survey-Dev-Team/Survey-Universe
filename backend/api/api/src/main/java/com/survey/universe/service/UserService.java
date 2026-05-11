package com.survey.universe.service;

import java.util.List;
import java.util.Optional;

import com.survey.universe.domain.model.User;

public interface UserService {
	
	public Optional<User> findById(String id);
	
	public Optional<User> findByEmail(String email);
	
	public Optional<User> add(User user);
	
	public Optional<User> update(User user);
	
	public List<User> getAll();

	public List<User> filter(String search, Boolean isDeleted);
}

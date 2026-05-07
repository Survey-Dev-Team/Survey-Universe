package com.survey.universe.api.exception.type;

public class UserAlreadyExistsException extends RuntimeException {
	
	private static final long serialVersionUID = -3807058969935963470L;

	public UserAlreadyExistsException(String message) {
		super(message);
	}

}

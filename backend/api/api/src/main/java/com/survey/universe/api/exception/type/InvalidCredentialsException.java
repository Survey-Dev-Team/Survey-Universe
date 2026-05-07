package com.survey.universe.api.exception.type;

public class InvalidCredentialsException extends RuntimeException {

	private static final long serialVersionUID = 7999030333525980081L;

	public InvalidCredentialsException(String message) {
		super(message);
	}

}

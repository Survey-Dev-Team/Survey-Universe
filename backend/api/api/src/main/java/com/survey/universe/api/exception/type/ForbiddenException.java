package com.survey.universe.api.exception.type;

public class ForbiddenException extends RuntimeException {

	private static final long serialVersionUID = -6701466873353676151L;

	public ForbiddenException(String message) {
        super(message);
    }
}
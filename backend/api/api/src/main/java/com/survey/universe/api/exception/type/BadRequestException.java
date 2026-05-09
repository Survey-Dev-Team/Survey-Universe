package com.survey.universe.api.exception.type;

public class BadRequestException extends RuntimeException {

	private static final long serialVersionUID = -1971660749649914028L;

	public BadRequestException(String message) {
        super(message);
    }
}
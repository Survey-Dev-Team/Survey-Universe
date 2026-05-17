package com.survey.universe.exception.type;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = -2179110497758187545L;
	
	public ResourceNotFoundException(String message) {
		super(message);
	}

}

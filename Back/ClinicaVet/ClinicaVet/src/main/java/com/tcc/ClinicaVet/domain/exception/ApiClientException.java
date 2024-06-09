package com.tcc.ClinicaVet.domain.exception;

public class ApiClientException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ApiClientException(String message) {
		
		super(message);
	}
}

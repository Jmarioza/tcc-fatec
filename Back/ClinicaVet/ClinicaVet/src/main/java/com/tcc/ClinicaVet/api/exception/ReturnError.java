package com.tcc.ClinicaVet.api.exception;

import java.io.Serial;
import java.io.Serializable;

/**
 * Classe padrao para representar uma resposta de erro.
 */
public class ReturnError implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;
	
	private Integer code;
	
	private String message;

	public ReturnError() {
		// Construtor vazio
	}

	public ReturnError(Integer code, String message) {
		this.code = code;
		this.message = message;
	}

	public Integer getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}
}
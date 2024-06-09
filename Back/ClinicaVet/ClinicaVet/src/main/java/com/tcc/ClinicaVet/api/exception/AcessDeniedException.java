package com.tcc.ClinicaVet.api.exception;

import java.io.Serial;

/**
 * Classe para representar excecao de Acesso Negado.
 */
public class AcessDeniedException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public AcessDeniedException(String message) {
    	
        super(message);
    }
}

package com.tcc.ClinicaVet.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tcc.ClinicaVet.domain.model.Clientes;

@Service
public interface ClienteService {

	List<Clientes> findAll();

	void deleteById(Long id);

	Optional<Clientes> findById(Long id);

	Clientes save(Clientes cliente);


}
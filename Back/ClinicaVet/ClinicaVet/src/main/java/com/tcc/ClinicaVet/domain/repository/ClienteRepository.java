package com.tcc.ClinicaVet.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.ClinicaVet.domain.model.Clientes;

public interface ClienteRepository extends JpaRepository<Clientes, Integer> {

	Optional<Clientes> findById(Long id);

	void deleteById(Long id);

}
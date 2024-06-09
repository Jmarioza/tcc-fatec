package com.tcc.ClinicaVet.domain.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tcc.ClinicaVet.domain.exception.ApiClientException;
import com.tcc.ClinicaVet.domain.model.Clientes;
import com.tcc.ClinicaVet.domain.repository.ClienteRepository;
import com.tcc.ClinicaVet.domain.service.ClienteService;

@Service
public class ClienteServiceImpl implements ClienteService {

	private final ClienteRepository clienteRepository;

	public ClienteServiceImpl(ClienteRepository clienteRepository) {
		this.clienteRepository = clienteRepository;
	}

	@Override
	public List<Clientes> findAll() {
		List<Clientes> clientes = this.clienteRepository.findAll();
		if (clientes.isEmpty()) {
			throw new ApiClientException("Nenhum registro encontrado.");
		}
		return clientes;
	}

	public Optional<Clientes> findById(Long id) {
		return clienteRepository.findById(id);
	}

	@Override
	public Clientes save(Clientes cliente) {
		return clienteRepository.save(cliente);
	}

	@Override
	public void deleteById(Long id) {
		clienteRepository.deleteById(id);
	}
}

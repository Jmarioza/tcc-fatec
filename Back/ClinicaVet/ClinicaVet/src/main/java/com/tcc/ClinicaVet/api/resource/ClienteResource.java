package com.tcc.ClinicaVet.api.resource;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.ClinicaVet.api.dto.ClienteDto;
import com.tcc.ClinicaVet.domain.exception.ApiClientException;
import com.tcc.ClinicaVet.domain.model.Clientes;
import com.tcc.ClinicaVet.domain.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteResource {

	private final ClienteService clienteService;
	private final ModelMapper modelMapper;

	public ClienteResource(ClienteService clienteService, ModelMapper modelMapper) {
		this.clienteService = clienteService;
		this.modelMapper = modelMapper;
	}

	@GetMapping
	public ResponseEntity<List<ClienteDto>> findAll() {
		List<Clientes> clientesList = this.clienteService.findAll();
		List<ClienteDto> clienteDtoList = clientesList.stream()
				.map(cliente -> this.modelMapper.map(cliente, ClienteDto.class)).collect(Collectors.toList());

		return ResponseEntity.ok(clienteDtoList);
	}

	@PostMapping
	public ResponseEntity<ClienteDto> create(@RequestBody ClienteDto clienteDto) {
		Clientes cliente = this.modelMapper.map(clienteDto, Clientes.class);
		Clientes createdCliente = this.clienteService.save(cliente);
		ClienteDto createdClienteDto = this.modelMapper.map(createdCliente, ClienteDto.class);

		return new ResponseEntity<>(createdClienteDto, HttpStatus.CREATED);
	}

	@DeleteMapping("/{id}")
    public ResponseEntity<ClienteDto> delete(@PathVariable Long id) {
        Clientes cliente = this.clienteService.findById(id)
                .orElseThrow(() -> new ApiClientException("Cliente não encontrado."));

        this.clienteService.deleteById(id);

        ClienteDto clienteDto = this.modelMapper.map(cliente, ClienteDto.class);
        
        return ResponseEntity.ok(clienteDto);
    }
}

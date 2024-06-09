package com.tcc.ClinicaVet.api.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

public class PetDto implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	private Integer id;

	private String nome;

	private String porte;

	private String especie;

	private String pessoa_responsavel;

	public PetDto() {
		// Construtor vazio
	}

	public PetDto(Integer id, String nome, String porte, String especie, String pessoa_responsavel) {
		this.id = id;
		this.nome = nome;
		this.porte = porte;
		this.especie = especie;
		this.pessoa_responsavel = pessoa_responsavel;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getPorte() {
		return porte;
	}

	public void setPorte(String porte) {
		this.porte = porte;
	}

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public String getPessoa_responsavel() {
		return pessoa_responsavel;
	}

	public void setPessoa_responsavel(String pessoa_responsavel) {
		this.pessoa_responsavel = pessoa_responsavel;
	}

	@Override
	public int hashCode() {
		return Objects.hash(especie, id, nome, pessoa_responsavel, porte);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PetDto other = (PetDto) obj;
		return Objects.equals(especie, other.especie) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(pessoa_responsavel, other.pessoa_responsavel)
				&& Objects.equals(porte, other.porte);
	}
}
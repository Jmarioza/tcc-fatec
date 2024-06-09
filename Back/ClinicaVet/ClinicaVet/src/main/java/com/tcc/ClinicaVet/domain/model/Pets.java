package com.tcc.ClinicaVet.domain.model;

import static org.apache.commons.lang3.StringUtils.rightPad;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "pets")
public class Pets implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Embedded
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;

	@Column(name = "nome", length = 200)
	private String nome = rightPad("", 200);

	@Column(name = "porte", length = 250)
	private String porte = rightPad("", 250);

	@Column(name = "especie", length = 250)
	private String especie = rightPad("", 250);

	@Column(name = "pessoa_responsavel", length = 200)
	private String pessoa_responsavel = rightPad("", 200);

	public Pets() {
		// Construtor vazio
	}

	public Pets(Integer id, String nome, String porte, String especie, String pessoa_responsavel) {
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
		Pets other = (Pets) obj;
		return Objects.equals(especie, other.especie) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(pessoa_responsavel, other.pessoa_responsavel)
				&& Objects.equals(porte, other.porte);
	}
}

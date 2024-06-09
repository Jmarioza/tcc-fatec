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
@Table(name = "servicos")
public class Atendimentos implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Embedded
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;

	@Column(name = "nome", length = 200)
	private String nome = rightPad("", 200);

	@Column(name = "sintoma", length = 200)
	private String sintoma = rightPad("", 200);

	@Column(name = "receita", length = 250)
	private String receita = rightPad("", 250);

	public Atendimentos() {
		// Construtor vazio
	}

	public Atendimentos(Integer id, String nome, String sintoma, String receita) {
		this.id = id;
		this.nome = nome;
		this.sintoma = sintoma;
		this.receita = receita;
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

	public String getSintoma() {
		return sintoma;
	}

	public void setSintoma(String sintoma) {
		this.sintoma = sintoma;
	}

	public String getReceita() {
		return receita;
	}

	public void setReceita(String receita) {
		this.receita = receita;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, nome, receita, sintoma);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Atendimentos other = (Atendimentos) obj;
		return Objects.equals(id, other.id) && Objects.equals(nome, other.nome)
				&& Objects.equals(receita, other.receita) && Objects.equals(sintoma, other.sintoma);
	}
}
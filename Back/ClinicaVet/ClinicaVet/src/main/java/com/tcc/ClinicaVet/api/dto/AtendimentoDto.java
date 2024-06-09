package com.tcc.ClinicaVet.api.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

public class AtendimentoDto implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	private Integer id;

	private String nome;

	private String sintoma;

	private String receita;

	public AtendimentoDto() {
		// Construtor vazio
	}

	public AtendimentoDto(Integer id, String nome, String sintoma, String receita) {
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
		AtendimentoDto other = (AtendimentoDto) obj;
		return Objects.equals(id, other.id) && Objects.equals(nome, other.nome)
				&& Objects.equals(receita, other.receita) && Objects.equals(sintoma, other.sintoma);
	}

}

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
@Table(name = "funcionarios")
public class Funcionarios implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Embedded
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;

	@Column(name = "nome", length = 200)
	private String nome = rightPad("", 200);

	@Column(name = "rg", length = 20)
	private String rg = rightPad("", 20);

	@Column(name = "cpf", length = 20)
	private String cpf = rightPad("", 20);

	@Column(name = "cnpj", length = 20)
	private String cnpj = rightPad("", 20);

	@Column(name = "email", length = 250)
	private String email = rightPad("", 250);

	@Column(name = "telefone", length = 15)
	private String telefone = rightPad("", 15);

	@Column(name = "cidade", length = 250)
	private String cidade = rightPad("", 250);

	@Column(name = "uf", length = 2)
	private String uf = rightPad("", 2);

	@Column(name = "bairro", length = 250)
	private String bairro = rightPad("", 250);

	@Column(name = "cep", length = 10)
	private String cep = rightPad("", 10);

	public Funcionarios() {
		// Construtor vazio
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

	public String getRg() {
		return rg;
	}

	public void setRg(String rg) {
		this.rg = rg;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	@Override
	public int hashCode() {
		return Objects.hash(bairro, cep, cidade, cnpj, cpf, email, id, nome, rg, telefone, uf);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Funcionarios other = (Funcionarios) obj;
		return Objects.equals(bairro, other.bairro) && Objects.equals(cep, other.cep)
				&& Objects.equals(cidade, other.cidade) && Objects.equals(cnpj, other.cnpj)
				&& Objects.equals(cpf, other.cpf) && Objects.equals(email, other.email) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(rg, other.rg)
				&& Objects.equals(telefone, other.telefone) && Objects.equals(uf, other.uf);
	}
}

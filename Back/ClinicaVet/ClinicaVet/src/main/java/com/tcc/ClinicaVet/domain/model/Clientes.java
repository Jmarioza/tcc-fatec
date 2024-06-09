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
@Table(name = "clientes")
public class Clientes implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Embedded
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;

	@Column(name = "tenant_id")
	private Integer tenant_id = 0;

	@Column(name = "nome", length = 250)
	private String nome = rightPad("", 250);

	@Column(name = "endereco", length = 250)
	private String endereco = rightPad("", 250);

	@Column(name = "endnum", length = 20)
	private String endnum = rightPad("", 20);

	@Column(name = "uf", length = 2)
	private String uf = rightPad("", 2);

	@Column(name = "cidade", length = 250)
	private String cidade = rightPad("", 250);

	@Column(name = "bairro", length = 250)
	private String bairro = rightPad("", 250);

	@Column(name = "cep", length = 10)
	private String cep = rightPad("", 10);

	@Column(name = "rg", length = 20)
	private String rg = rightPad("", 20);

	@Column(name = "nome", length = 250)
	private String pessoa_responsavel = rightPad("", 250);

	@Column(name = "telefone", length = 15)
	private String telefone = rightPad("", 15);

	@Column(name = "email", length = 250)
	private String email = rightPad("", 250);

	@Column(name = "cpf", length = 20)
	private String cpf = rightPad("", 20);

	public Clientes() {
		// Construtor vazio
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getTenant_id() {
		return tenant_id;
	}

	public void setTenant_id(Integer tenant_id) {
		this.tenant_id = tenant_id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEndereco() {
		return endereco;
	}

	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}

	public String getEndnum() {
		return endnum;
	}

	public void setEndnum(String endnum) {
		this.endnum = endnum;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
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

	public String getRg() {
		return rg;
	}

	public void setRg(String rg) {
		this.rg = rg;
	}

	public String getPessoa_responsavel() {
		return pessoa_responsavel;
	}

	public void setPessoa_responsavel(String pessoa_responsavel) {
		this.pessoa_responsavel = pessoa_responsavel;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	@Override
	public int hashCode() {
		return Objects.hash(bairro, cep, cidade, cpf, email, endereco, endnum, id, nome, pessoa_responsavel, rg,
				telefone, tenant_id, uf);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Clientes other = (Clientes) obj;
		return Objects.equals(bairro, other.bairro) && Objects.equals(cep, other.cep)
				&& Objects.equals(cidade, other.cidade) && Objects.equals(cpf, other.cpf)
				&& Objects.equals(email, other.email) && Objects.equals(endereco, other.endereco)
				&& Objects.equals(endnum, other.endnum) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(pessoa_responsavel, other.pessoa_responsavel)
				&& Objects.equals(rg, other.rg) && Objects.equals(telefone, other.telefone)
				&& Objects.equals(tenant_id, other.tenant_id) && Objects.equals(uf, other.uf);
	}
}
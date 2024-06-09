package com.tcc.ClinicaVet.api.dto;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

public class ClienteDto implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	private Integer id;

	private Integer tenant_id;

	private String nome;

	private String endereco;

	private String endnum;

	private String uf;

	private String cidade;

	private String bairro;

	private String cep;

	private String rg;

	private String pessoa_responsavel;

	private String telefone;

	private String email;

	private String cpf;

	public ClienteDto() {
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
		ClienteDto other = (ClienteDto) obj;
		return Objects.equals(bairro, other.bairro) && Objects.equals(cep, other.cep)
				&& Objects.equals(cidade, other.cidade) && Objects.equals(cpf, other.cpf)
				&& Objects.equals(email, other.email) && Objects.equals(endereco, other.endereco)
				&& Objects.equals(endnum, other.endnum) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(pessoa_responsavel, other.pessoa_responsavel)
				&& Objects.equals(rg, other.rg) && Objects.equals(telefone, other.telefone)
				&& Objects.equals(tenant_id, other.tenant_id) && Objects.equals(uf, other.uf);
	}
}
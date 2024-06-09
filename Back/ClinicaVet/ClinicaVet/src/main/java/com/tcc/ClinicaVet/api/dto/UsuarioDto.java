package com.tcc.ClinicaVet.api.dto;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

public class UsuarioDto implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	private Integer id;
	
	private LocalDate create_at;

	private String nome;
	
	private String senha;
	
	private Integer status;
	
	private LocalDate update_at;
	
	private String uuid;
	
	private Integer profile_id;
	
	public UsuarioDto() {
		// Construtor vazio
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDate getCreate_at() {
		return create_at;
	}

	public void setCreate_at(LocalDate create_at) {
		this.create_at = create_at;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public LocalDate getUpdate_at() {
		return update_at;
	}

	public void setUpdate_at(LocalDate update_at) {
		this.update_at = update_at;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Integer getProfile_id() {
		return profile_id;
	}

	public void setProfile_id(Integer profile_id) {
		this.profile_id = profile_id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(create_at, id, nome, profile_id, senha, status, update_at, uuid);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		UsuarioDto other = (UsuarioDto) obj;
		return Objects.equals(create_at, other.create_at) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(profile_id, other.profile_id)
				&& Objects.equals(senha, other.senha) && Objects.equals(status, other.status)
				&& Objects.equals(update_at, other.update_at) && Objects.equals(uuid, other.uuid);
	}
}
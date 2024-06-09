package com.tcc.ClinicaVet.domain.model;

import static org.apache.commons.lang3.StringUtils.rightPad;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Embedded
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "create_at")
	private LocalDate create_at;

	@Column(name = "nome", length = 200)
	private String nome = rightPad("", 200);
	
	@Column(name = "senha", length = 255)
	private String senha = rightPad("", 255);
	
	@Column(name = "status")
	private Integer status = 0;
	
	@Column(name = "update_at")
	private LocalDate update_at;
	
	@Column(name = "uuid", length = 36)
	private String uuid = rightPad("", 36);
	
	@Column(name = "profile_id")
	private Integer profile_id = 0;
	
	public Usuario() {
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
		Usuario other = (Usuario) obj;
		return Objects.equals(create_at, other.create_at) && Objects.equals(id, other.id)
				&& Objects.equals(nome, other.nome) && Objects.equals(profile_id, other.profile_id)
				&& Objects.equals(senha, other.senha) && Objects.equals(status, other.status)
				&& Objects.equals(update_at, other.update_at) && Objects.equals(uuid, other.uuid);
	}
}
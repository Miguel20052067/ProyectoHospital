package com.lifechat.lifechat_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lifechat.lifechat_backend.model.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    Optional<Medico> findByEmail(String email);
}
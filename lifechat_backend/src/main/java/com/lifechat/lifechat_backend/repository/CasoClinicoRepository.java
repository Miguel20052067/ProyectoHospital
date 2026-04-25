package com.lifechat.lifechat_backend.repository;

import com.lifechat.lifechat_backend.model.CasoClinico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CasoClinicoRepository extends JpaRepository<CasoClinico, Integer> {
}
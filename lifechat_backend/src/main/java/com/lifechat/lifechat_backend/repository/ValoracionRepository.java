package com.lifechat.lifechat_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lifechat.lifechat_backend.model.Medico;
import com.lifechat.lifechat_backend.model.Valoracion;

public interface ValoracionRepository extends JpaRepository<Valoracion, Integer> {
    List<Valoracion> findByMedico(Medico medico);
    boolean existsByMedicoAndCasoId(Medico medico, Integer casoId);
}
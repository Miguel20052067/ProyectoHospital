package com.lifechat.lifechat_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.lifechat.lifechat_backend.model.Asignacion;
import com.lifechat.lifechat_backend.model.Medico;

public interface AsignacionRepository extends JpaRepository<Asignacion, Integer> {

    List<Asignacion> findByMedico(Medico medico);

    @Query("SELECT COUNT(a) FROM Asignacion a WHERE a.caso.id = :casoId")
    Long contarAsignacionesPorCaso(Integer casoId);

    @Query(value = "SELECT c.id FROM casos_clinicos c WHERE (SELECT COUNT(*) FROM asignaciones a WHERE a.caso_id = c.id) < 2 ORDER BY RANDOM() LIMIT 100", nativeQuery = true)
    List<Integer> obtenerCasosDisponiblesAleatorios();
}

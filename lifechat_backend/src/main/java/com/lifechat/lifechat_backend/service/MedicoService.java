package com.lifechat.lifechat_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lifechat.lifechat_backend.model.Asignacion;
import com.lifechat.lifechat_backend.model.CasoClinico;
import com.lifechat.lifechat_backend.model.Medico;
import com.lifechat.lifechat_backend.repository.AsignacionRepository;
import com.lifechat.lifechat_backend.repository.CasoClinicoRepository;
import com.lifechat.lifechat_backend.repository.MedicoRepository;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private CasoClinicoRepository casoClinicoRepository;

    public Medico obtenerOCrearMedico(String email, String nombre) {
        Optional<Medico> medicoExistente = medicoRepository.findByEmail(email);

        if (medicoExistente.isPresent()) {
            return medicoExistente.get();
        }

        // Crear nuevo médico
        Medico medico = new Medico();
        medico.setEmail(email);
        medico.setNombre(nombre);
        medico.setFecha_registro(LocalDateTime.now());
        medico = medicoRepository.save(medico);

        // Asignar 100 casos aleatorios
        asignarCasos(medico);

        return medico;
    }

    private void asignarCasos(Medico medico) {
        List<Integer> casosIds = asignacionRepository.obtenerCasosDisponiblesAleatorios();

        for (Integer casoId : casosIds) {
            CasoClinico caso = casoClinicoRepository.findById(casoId).orElse(null);
            if (caso == null) continue;

            Asignacion asignacion = new Asignacion();
            asignacion.setMedico(medico);
            asignacion.setCaso(caso);
            asignacion.setCompletado(false);
            asignacion.setFecha_asignacion(LocalDateTime.now());
            asignacionRepository.save(asignacion);
        }
    }

    public List<CasoClinico> obtenerCasosAsignados(Medico medico) {
        List<Asignacion> asignaciones = asignacionRepository.findByMedico(medico);
        List<CasoClinico> casos = new ArrayList<>();
        for (Asignacion asignacion : asignaciones) {
            casos.add(asignacion.getCaso());
        }
        return casos;
    }
}

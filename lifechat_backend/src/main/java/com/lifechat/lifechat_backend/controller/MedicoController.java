package com.lifechat.lifechat_backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lifechat.lifechat_backend.model.CasoClinico;
import com.lifechat.lifechat_backend.model.Medico;
import com.lifechat.lifechat_backend.model.Valoracion;
import com.lifechat.lifechat_backend.repository.AsignacionRepository;
import com.lifechat.lifechat_backend.repository.ValoracionRepository;
import com.lifechat.lifechat_backend.service.MedicoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MedicoController {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    // Obtener médico actual y sus casos asignados
    @GetMapping("/mis-casos")
    public List<CasoClinico> getMisCasos(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        String nombre = principal.getAttribute("name");
        Medico medico = medicoService.obtenerOCrearMedico(email, nombre);
        return medicoService.obtenerCasosAsignados(medico);
    }

    // Guardar valoración
    @PostMapping("/valoracion")
    public String guardarValoracion(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, Object> body) {

        String email = principal.getAttribute("email");
        String nombre = principal.getAttribute("name");
        Medico medico = medicoService.obtenerOCrearMedico(email, nombre);

        Integer casoId = (Integer) body.get("casoId");

        // Comprobar si ya valoró este caso
        if (valoracionRepository.existsByMedicoAndCasoId(medico, casoId)) {
            return "Ya has valorado este caso";
        }

        Valoracion valoracion = new Valoracion();
        valoracion.setMedico(medico);
        valoracion.setFecha(LocalDateTime.now());
        valoracion.setPrecision_diagnostica((Integer) body.get("precision_diagnostica"));
        valoracion.setClaridad_textual((Integer) body.get("claridad_textual"));
        valoracion.setRelevancia_clinica((Integer) body.get("relevancia_clinica"));
        valoracion.setAdecuacion_contextual((Integer) body.get("adecuacion_contextual"));
        valoracion.setNivel_tecnico((Integer) body.get("nivel_tecnico"));
        valoracion.setComentario((String) body.get("comentario"));

        // Asignar caso
        com.lifechat.lifechat_backend.model.CasoClinico caso = new com.lifechat.lifechat_backend.model.CasoClinico();
        caso.setId(casoId);
        valoracion.setCaso(caso);

        valoracionRepository.save(valoracion);

        // Marcar asignación como completada
        asignacionRepository.findByMedico(medico).stream()
            .filter(a -> a.getCaso().getId().equals(casoId))
            .findFirst()
            .ifPresent(a -> {
                a.setCompletado(true);
                asignacionRepository.save(a);
            });

        return "Valoración guardada correctamente";
    }

    // Obtener info del médico actual
    @GetMapping("/me")
    public Map<String, Object> getMe(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        String nombre = principal.getAttribute("name");
        Medico medico = medicoService.obtenerOCrearMedico(email, nombre);
        return Map.of(
            "id", medico.getId(),
            "email", medico.getEmail(),
            "nombre", medico.getNombre()
        );
    }
}
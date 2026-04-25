package com.lifechat.lifechat_backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "valoraciones")
public class Valoracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "medico_id")
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "caso_id")
    private CasoClinico caso;

    private Integer precision_diagnostica;
    private Integer claridad_textual;
    private Integer relevancia_clinica;
    private Integer adecuacion_contextual;
    private Integer nivel_tecnico;
    private String comentario;
    private LocalDateTime fecha;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public CasoClinico getCaso() {
        return caso;
    }

    public void setCaso(CasoClinico caso) {
        this.caso = caso;
    }

    public Integer getPrecision_diagnostica() {
        return precision_diagnostica;
    }

    public void setPrecision_diagnostica(Integer precision_diagnostica) {
        this.precision_diagnostica = precision_diagnostica;
    }

    public Integer getClaridad_textual() {
        return claridad_textual;
    }

    public void setClaridad_textual(Integer claridad_textual) {
        this.claridad_textual = claridad_textual;
    }

    public Integer getRelevancia_clinica() {
        return relevancia_clinica;
    }

    public void setRelevancia_clinica(Integer relevancia_clinica) {
        this.relevancia_clinica = relevancia_clinica;
    }

    public Integer getAdecuacion_contextual() {
        return adecuacion_contextual;
    }

    public void setAdecuacion_contextual(Integer adecuacion_contextual) {
        this.adecuacion_contextual = adecuacion_contextual;
    }

    public Integer getNivel_tecnico() {
        return nivel_tecnico;
    }

    public void setNivel_tecnico(Integer nivel_tecnico) {
        this.nivel_tecnico = nivel_tecnico;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}

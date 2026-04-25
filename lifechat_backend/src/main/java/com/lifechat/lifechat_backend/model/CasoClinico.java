package com.lifechat.lifechat_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "casos_clinicos")
public class CasoClinico {

    @Id
    private Integer id;
    private String edad;
    private String sexo;
    private String alergias;
    private String factores_sociales;
    private String antecedentes_medicos;
    private String antecedentes_quirurgicos;
    private String antecedentes_familiares;
    private String habitos;
    private String situacion_basal;
    private String medicacion_actual;
    private String motivo;
    private String sintomas;
    private String exploracion_general;
    private String signos;
    private String resultados_pruebas;
    private String razonamiento_clinico;
    private String diagnostico_final;
    private String tratamiento_farmacologico;
    private String tratamiento_no_farmacologico;
    private String referencias_bibliograficas;
    private String categoria;
    private String keywords;
    private String codigo_cie_10;
    private String dificultad;
    private String chunk_id;
    private String chunk;
    private String agente;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEdad() {
        return edad;
    }

    public void setEdad(String edad) {
        this.edad = edad;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getFactores_sociales() {
        return factores_sociales;
    }

    public void setFactores_sociales(String factores_sociales) {
        this.factores_sociales = factores_sociales;
    }

    public String getAntecedentes_medicos() {
        return antecedentes_medicos;
    }

    public void setAntecedentes_medicos(String antecedentes_medicos) {
        this.antecedentes_medicos = antecedentes_medicos;
    }

    public String getAntecedentes_quirurgicos() {
        return antecedentes_quirurgicos;
    }

    public void setAntecedentes_quirurgicos(String antecedentes_quirurgicos) {
        this.antecedentes_quirurgicos = antecedentes_quirurgicos;
    }

    public String getAntecedentes_familiares() {
        return antecedentes_familiares;
    }

    public void setAntecedentes_familiares(String antecedentes_familiares) {
        this.antecedentes_familiares = antecedentes_familiares;
    }

    public String getHabitos() {
        return habitos;
    }

    public void setHabitos(String habitos) {
        this.habitos = habitos;
    }

    public String getSituacion_basal() {
        return situacion_basal;
    }

    public void setSituacion_basal(String situacion_basal) {
        this.situacion_basal = situacion_basal;
    }

    public String getMedicacion_actual() {
        return medicacion_actual;
    }

    public void setMedicacion_actual(String medicacion_actual) {
        this.medicacion_actual = medicacion_actual;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }

    public String getExploracion_general() {
        return exploracion_general;
    }

    public void setExploracion_general(String exploracion_general) {
        this.exploracion_general = exploracion_general;
    }

    public String getSignos() {
        return signos;
    }

    public void setSignos(String signos) {
        this.signos = signos;
    }

    public String getResultados_pruebas() {
        return resultados_pruebas;
    }

    public void setResultados_pruebas(String resultados_pruebas) {
        this.resultados_pruebas = resultados_pruebas;
    }

    public String getRazonamiento_clinico() {
        return razonamiento_clinico;
    }

    public void setRazonamiento_clinico(String razonamiento_clinico) {
        this.razonamiento_clinico = razonamiento_clinico;
    }

    public String getDiagnostico_final() {
        return diagnostico_final;
    }

    public void setDiagnostico_final(String diagnostico_final) {
        this.diagnostico_final = diagnostico_final;
    }

    public String getTratamiento_farmacologico() {
        return tratamiento_farmacologico;
    }

    public void setTratamiento_farmacologico(String tratamiento_farmacologico) {
        this.tratamiento_farmacologico = tratamiento_farmacologico;
    }

    public String getTratamiento_no_farmacologico() {
        return tratamiento_no_farmacologico;
    }

    public void setTratamiento_no_farmacologico(String tratamiento_no_farmacologico) {
        this.tratamiento_no_farmacologico = tratamiento_no_farmacologico;
    }

    public String getReferencias_bibliograficas() {
        return referencias_bibliograficas;
    }

    public void setReferencias_bibliograficas(String referencias_bibliograficas) {
        this.referencias_bibliograficas = referencias_bibliograficas;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getCodigo_cie_10() {
        return codigo_cie_10;
    }

    public void setCodigo_cie_10(String codigo_cie_10) {
        this.codigo_cie_10 = codigo_cie_10;
    }

    public String getDificultad() {
        return dificultad;
    }

    public void setDificultad(String dificultad) {
        this.dificultad = dificultad;
    }

    public String getChunk_id() {
        return chunk_id;
    }

    public void setChunk_id(String chunk_id) {
        this.chunk_id = chunk_id;
    }

    public String getChunk() {
        return chunk;
    }

    public void setChunk(String chunk) {
        this.chunk = chunk;
    }

    public String getAgente() {
        return agente;
    }

    public void setAgente(String agente) {
        this.agente = agente;
    }
}

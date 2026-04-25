package com.lifechat.lifechat_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lifechat.lifechat_backend.model.CasoClinico;
import com.lifechat.lifechat_backend.repository.CasoClinicoRepository;

@RestController
@RequestMapping("/api/casos")
@CrossOrigin(origins = "*")
public class CasoClinicoController {

    @Autowired
    private CasoClinicoRepository casoClinicoRepository;

    @GetMapping
    public Page<CasoClinico> getCasos(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        return casoClinicoRepository.findAll(PageRequest.of(page, size));
    }
}
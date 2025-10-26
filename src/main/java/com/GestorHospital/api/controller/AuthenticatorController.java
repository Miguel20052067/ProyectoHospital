package com.GestorHospital.api.controller;

import com.GestorHospital.api.model.LoginRequest;
import com.GestorHospital.api.model.LoginResponse;
import com.GestorHospital.api.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cambiar según tu frontend
public class AuthenticatorController {

    @Autowired
    private AuthenticationService authService; // ✅ inyectamos el servicio, no el controller

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Llamada al servicio que valida las credenciales
            LoginResponse response = authService.authenticate(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error en el servidor"));
        }
    }

    // Clase interna para respuestas de error
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

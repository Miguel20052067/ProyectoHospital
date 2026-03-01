package com.Lifechat.gestion_hospital.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:8080"})
public class AuthController {

    /**
     * Obtener información del usuario autenticado
     */
    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", false);
            response.put("message", "Usuario no autenticado");
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("authenticated", true);
        userInfo.put("name", principal.getAttribute("name"));
        userInfo.put("email", principal.getAttribute("email"));
        userInfo.put("picture", principal.getAttribute("picture"));
        userInfo.put("sub", principal.getAttribute("sub")); // Google ID del usuario
        
        return ResponseEntity.ok(userInfo);
    }
    
    /**
     * Verificar si el usuario está autenticado
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", principal != null);
        
        if (principal != null) {
            response.put("email", principal.getAttribute("email"));
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint de éxito después del login (opcional)
     */
    @GetMapping("/success")
    public void loginSuccess(HttpServletResponse response) throws IOException {
        response.sendRedirect("/dashboard.html");
    }
    
    /**
     * Logout manual
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidar sesión
        request.getSession().invalidate();
        
        Map<String, String> result = new HashMap<>();
        result.put("message", "Logout exitoso");
        result.put("redirect", "/index.html");
        
        return ResponseEntity.ok(result);
    }
}
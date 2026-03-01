package com.Lifechat.gestion_hospital.config;

import com.Lifechat.gestion_hospital.service.UserAuthorizationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    
    private final UserAuthorizationService userAuthorizationService;
    
    public OAuth2LoginSuccessHandler(UserAuthorizationService userAuthorizationService) {
        this.userAuthorizationService = userAuthorizationService;
        System.out.println("✅ OAuth2LoginSuccessHandler CREADO");
    }
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       Authentication authentication) throws IOException, ServletException {
        
        System.out.println("\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢");
        System.out.println("🟢  LOGIN EXITOSO - VERIFICANDO AUTORIZACIÓN");
        System.out.println("🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢\n");
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        System.out.println("==============================================");
        System.out.println("🔐 VALIDANDO USUARIO");
        System.out.println("==============================================");
        System.out.println("👤 Nombre: " + name);
        System.out.println("📧 Email: " + email);
        
        if (email == null) {
            System.err.println("\n❌ ERROR: Email es NULL");
            System.out.println("==============================================\n");
            response.sendRedirect("/index.html?error=no_email");
            return;
        }
        
        System.out.println("\n🔍 Verificando contra whitelist...");
        boolean isAuthorized = userAuthorizationService.isAuthorized(email);
        
        System.out.println("📋 Whitelist: " + userAuthorizationService.getAuthorizedEmails());
        System.out.println("✅ ¿Está autorizado?: " + isAuthorized);
        
        if (!isAuthorized) {
            System.err.println("\n❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
            System.err.println("❌  ACCESO DENEGADO");
            System.err.println("❌  Email: " + email);
            System.err.println("❌  NO está en la whitelist");
            System.err.println("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n");
            
            // Invalidar la sesión
            request.getSession().invalidate();
            
            // Redirigir al login con error
            response.sendRedirect("/index.html?error=unauthorized&email=" + email);
            return;
        }
        
        System.out.println("\n✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
        System.out.println("✅  ACCESO PERMITIDO");
        System.out.println("✅  Email: " + email);
        System.out.println("✅  Redirigiendo a dashboard...");
        System.out.println("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅\n");
        
        // Permitir acceso
        response.sendRedirect("/pages/dashboard.html");
    }
}
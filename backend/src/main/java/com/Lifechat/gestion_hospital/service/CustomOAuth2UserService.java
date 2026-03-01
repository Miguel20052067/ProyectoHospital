package com.Lifechat.gestion_hospital.service;

import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Primary  // ← AÑADIR ESTO
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    
    private final UserAuthorizationService userAuthorizationService;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    
    public CustomOAuth2UserService(UserAuthorizationService userAuthorizationService) {
        this.userAuthorizationService = userAuthorizationService;
        System.out.println("✅✅✅ CustomOAuth2UserService CREADO con @Primary ✅✅✅");
    }
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("\n🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴");
        System.out.println("🔴  EJECUTANDO loadUser()");
        System.out.println("🔴  SI VES ESTO, LA VALIDACIÓN FUNCIONA");
        System.out.println("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n");
        
        OAuth2User user = delegate.loadUser(userRequest);
        String email = user.getAttribute("email");
        String name = user.getAttribute("name");
        
        System.out.println("==============================================");
        System.out.println("🔐 VERIFICANDO AUTORIZACIÓN DE USUARIO");
        System.out.println("==============================================");
        System.out.println("👤 Nombre: " + name);
        System.out.println("📧 Email: " + email);
        
        if (email == null) {
            System.err.println("\n❌ ERROR: Email es NULL");
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_user_info"),
                "Email no proporcionado por Google"
            );
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
            
            throw new OAuth2AuthenticationException(
                new OAuth2Error("unauthorized_user"),
                "ACCESO DENEGADO: El email " + email + " no está autorizado."
            );
        }
        
        System.out.println("\n✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
        System.out.println("✅  ACCESO PERMITIDO");
        System.out.println("✅  Email: " + email);
        System.out.println("✅  Usuario autorizado correctamente");
        System.out.println("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅\n");
        
        return user;
    }
}
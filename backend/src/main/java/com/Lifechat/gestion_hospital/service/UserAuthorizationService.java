//Servicio que se encarga de verificar si el email del usuario autenticado está en una lista blanca de 
// emails autorizados para acceder a la aplicación.

package com.Lifechat.gestion_hospital.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class UserAuthorizationService {
    
    private final List<String> authorizedEmails = Arrays.asList(
        "holanotengocreatividad431@gmail.com",
        "pedro.arrierodomec@riberadeltajo.es",
        "pablo.sedenofrias@riberadeltajo.es"
    );
    
    public UserAuthorizationService() {
        System.out.println(" UserAuthorizationService creado");
        System.out.println(" Emails autorizados: " + authorizedEmails);
    }
    
    public boolean isAuthorized(String email) {
        if (email == null) {
            return false;
        }
        String emailLower = email.toLowerCase();
        boolean result = authorizedEmails.contains(emailLower);
        System.out.println(" Verificando: " + email + " → " + result);
        return result;
    }
    
    public List<String> getAuthorizedEmails() {
        return authorizedEmails;
    }
}
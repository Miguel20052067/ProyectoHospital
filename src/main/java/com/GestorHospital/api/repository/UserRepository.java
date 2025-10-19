package com.GestorHospital.api.repository;

import com.GestorHospital.api.model.User;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public class UserRepository {

    private final List<User> usuarios;

    // Constructor que inicializa la lista de usuarios (simula una base de datos)
    public UserRepository() {
        this.usuarios = new ArrayList<>();
        
        // Agregar 10 usuarios de ejemplo con email y contraseña
        usuarios.add(new User( "juan@correo.com", "Password123"));
        usuarios.add(new User("maria@correo.com", "Secure456"));
        usuarios.add(new User( "carlos@correo.com", "MyPass789"));
        usuarios.add(new User( "ana@correo.com", "Strong101"));
        usuarios.add(new User( "luis@correo.com", "Admin202"));
        usuarios.add(new User( "sofia@correo.com", "User303"));
        usuarios.add(new User( "pedro@correo.com", "Pass404"));
        usuarios.add(new User( "laura@correo.com", "Secret505"));
        usuarios.add(new User("diego@correo.com", "Login606"));
        usuarios.add(new User( "elena@correo.com", "Access707"));
    }

    // Buscar usuario por email
    public User findByEmail(String email) {
        return usuarios.stream()
                .filter(user -> user.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    // Obtener todos los usuarios
    public List<User> findAll() {
        return new ArrayList<>(usuarios);
    }

    // Guardar un nuevo usuario
    public User save(User user) {
       
        usuarios.add(user);
        return user;
    }

    // Verificar si un usuario existe por email
    public boolean existsByEmail(String email) {
        return usuarios.stream()
                .anyMatch(user -> user.getEmail().equalsIgnoreCase(email));
    }

   

    
}
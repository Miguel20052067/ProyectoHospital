package com.GestorHospital.api.service;

import com.GestorHospital.api.model.LoginResponse;
import com.GestorHospital.api.model.User;
import com.GestorHospital.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Autentica un usuario verificando sus credenciales en la base de datos
     * @param email Correo electrónico del usuario
     * @param password Contraseña del usuario
     * @return LoginResponse con información del usuario si es correcto
     * @throws IllegalArgumentException si las credenciales son incorrectas
     */
    public LoginResponse authenticate(String email, String password) {
        // Validar que el email no sea nulo o vacío
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es requerido");
        }

        // Validar que la contraseña no sea nula o vacía
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        // Validar formato de email básico
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("El correo electrónico no tiene un formato válido");
        }

        // Buscar usuario por email en la base de datos
        User user = userRepository.findByEmail(email);

        // Verificar si el usuario existe
        if (user == null) {
            throw new IllegalArgumentException("El usuario no existe");
        }

        // Verificar si la contraseña es correcta
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }

        // Retornar respuesta exitosa con datos del usuario
        return new LoginResponse(
                "¡Bienvenido! Login exitoso.",
                true,
                user.getEmail()
               
        );
    }

    /**
     * Valida que el email tenga un formato válido
     * @param email Correo electrónico a validar
     * @return true si el email es válido, false en caso contrario
     */
    public boolean isValidEmail(String email) {
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        return email.matches(emailRegex);
    }

    /**
     * Valida que la contraseña cumpla con los requisitos mínimos
     * - Mínimo 8 caracteres
     * - Al menos un número
     * - Al menos una letra mayúscula
     * @param password Contraseña a validar
     * @return true si cumple con los requisitos
     */
    public boolean isPasswordValid(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        // Verificar que tenga al menos un número
        boolean tieneNumero = password.matches(".*\\d.*");

        // Verificar que tenga al menos una mayúscula
        boolean tieneMayuscula = password.matches(".*[A-Z].*");

        return tieneNumero && tieneMayuscula;
    }

    /**
     * Busca un usuario por su correo electrónico
     * @param email Correo electrónico
     * @return Usuario encontrado o null si no existe
     */
    public User findUserByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        return userRepository.findByEmail(email);
    }

    /**
     * Busca un usuario por su ID
     * @param id ID del usuario
     * @return Usuario encontrado o null si no existe
     */
    public User findUserById(int id) {
        return userRepository.findById(id);
    }

    /**
     * Verifica si un usuario existe por email
     * @param email Correo electrónico
     * @return true si existe, false si no
     */
    public boolean userExists(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return userRepository.existsByEmail(email);
    }

    /**
     * Obtiene todos los usuarios registrados
     * @return Lista de usuarios
     */
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Registra un nuevo usuario
     * @param email Correo electrónico del nuevo usuario
     * @param password Contraseña del nuevo usuario
     * @return LoginResponse con información del usuario creado
     * @throws IllegalArgumentException si el usuario ya existe o los datos no son válidos
     */
    public LoginResponse registerUser(String email, String password) {
        // Validar que el email no sea nulo o vacío
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es requerido");
        }

        // Validar que la contraseña no sea nula o vacía
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        // Validar formato de email
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("El correo electrónico no tiene un formato válido");
        }

        // Validar requisitos de contraseña
        if (!isPasswordValid(password)) {
            throw new IllegalArgumentException("La contraseña debe tener mínimo 8 caracteres, al menos un número y una mayúscula");
        }

        // Verificar si el usuario ya existe
        if (userExists(email)) {
            throw new IllegalArgumentException("El usuario con este correo ya existe");
        }

        // Crear nuevo usuario
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(password);

        // Guardar en la base de datos
        User savedUser = userRepository.save(newUser);

        // Retornar respuesta de éxito
        return new LoginResponse(
                "Usuario registrado exitosamente.",
                true,
                savedUser.getEmail()
                
        );
    }

    /**
     * Actualiza la contraseña de un usuario
     * @param email Correo electrónico del usuario
     * @param oldPassword Contraseña actual
     * @param newPassword Nueva contraseña
     * @return LoginResponse con mensaje de éxito o error
     * @throws IllegalArgumentException si los datos no son válidos
     */
    public LoginResponse changePassword(String email, String oldPassword, String newPassword) {
        // Validar que el email no sea nulo
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es requerido");
        }

        // Buscar el usuario
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("El usuario no existe");
        }

        // Verificar que la contraseña actual sea correcta
        if (!user.getPassword().equals(oldPassword)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // Validar la nueva contraseña
        if (!isPasswordValid(newPassword)) {
            throw new IllegalArgumentException("La nueva contraseña debe tener mínimo 8 caracteres, al menos un número y una mayúscula");
        }

        // Actualizar la contraseña
        user.setPassword(newPassword);
        userRepository.update(user);

        return new LoginResponse(
                "Contraseña actualizada exitosamente.",
                true,
                user.getEmail()
                
        );
    }

    /**
     * Valida las credenciales sin autenticar (solo verifica formato)
     * @param email Email a validar
     * @param password Contraseña a validar
     * @return true si ambos tienen formato válido
     */
    public boolean validateCredentialsFormat(String email, String password) {
        return isValidEmail(email) && isPasswordValid(password);
    }
}

package com.GestorHospital.api.model;


public class LoginResponse {
    private String message;
    private boolean success;
    private String email;

   
    // Constructor básico
    public LoginResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    // Constructor con datos de usuario
    public LoginResponse(String message, boolean success, String email) {
        this.message = message;
        this.success = success;
        this.email = email;
        
    }

    // Getters y Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

 

    @Override
    public String toString() {
        return "LoginResponse{" +
                "message='" + message + '\'' +
                ", success=" + success +
                ", email='" + email + '\'' +  
                '}';
    }
}
package com.GestorHospital.api.model;

public class User {
    private int id; // necesario para findById
    private String email;
    private String password;

    // Constructor vacío
    public User() {}

    // Constructor con email y password
    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters y setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

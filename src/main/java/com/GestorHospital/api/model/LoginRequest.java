
package com.GestorHospital.api.model;

public class LoginRequest {
    private String eMail;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String eMail, String password) {
        this.eMail = eMail;
        this.password = password;
    }

    public String geteMail() {
        return eMail;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

     @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + eMail + '\'' +
                '}';
    }
}
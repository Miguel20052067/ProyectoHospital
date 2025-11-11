package com.GestorHospital;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication(scanBasePackages = "com.GestorHospital")
public class GhApplication {

    /**
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(GhApplication.class, args);
    }
}

//Configura y gestiona la comunicacion entre el frontend y el backend, 
// definiendo rutas para recursos estáticos y redirigiendo la raíz a index.html

package com.Lifechat.gestion_hospital.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path currentPath = Paths.get("").toAbsolutePath();
        Path frontendPath;
        
        // Detectar automáticamente la ubicación del frontend
        if (currentPath.endsWith("backend")) {
            // Si estamos en GestionHospital/backend/
            frontendPath = currentPath.getParent().resolve("frontend");
        } else {
            // Si estamos en GestionHospital/
            frontendPath = currentPath.resolve("frontend");
        }
        
        String frontendLocation = "file:" + frontendPath.toString().replace("\\", "/") + "/";
        
        System.out.println("\n===============================================");
        System.out.println(" CONFIGURACIÓN DE RUTAS FRONTEND");
        System.out.println("===============================================");
        System.out.println(" Ruta actual: " + currentPath);
        System.out.println(" Ruta frontend: " + frontendPath);
        System.out.println(" Frontend location: " + frontendLocation);
        System.out.println(" ¿Frontend existe?: " + frontendPath.toFile().exists());
        
        if (frontendPath.toFile().exists()) {
            System.out.println("\n📂 Contenido de frontend:");
            File[] files = frontendPath.toFile().listFiles();
            if (files != null) {
                for (File file : files) {
                    System.out.println("   " + (file.isDirectory() ? " " : " ") + " " + file.getName());
                }
            }
            
            File indexFile = new File(frontendPath.toFile(), "index.html");
            System.out.println("\n  index.html existe: " + indexFile.exists());
            
            File dashboardFile = new File(frontendPath.toFile(), "pages/dashboard.html");
            System.out.println("  pages/dashboard.html existe: " + dashboardFile.exists());
        } else {
            System.err.println("\n  ERROR: Frontend no encontrado");
        }
        System.out.println("===============================================\n");
        
        registry.addResourceHandler("/**")
                .addResourceLocations(frontendLocation)
                .setCachePeriod(0);
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/")
                .setViewName("forward:/index.html");
    }
}
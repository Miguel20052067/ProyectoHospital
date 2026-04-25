# Instrucciones de Deployment en Servidor Linux del Instituto

## Requisitos
- Docker instalado en Linux
- Docker Compose instalado
- PostgreSQL corriendo en el servidor (puerto 5432)
- Acceso SSH al servidor

## Pasos para desplegar:

### 1. Subir el proyecto al servidor (desde tu máquina Windows)
```bash
# En PowerShell:
scp -r C:\Users\centr\Desktop\lifechat usuario@servidor-instituto:/home/usuario/
```

Si no tienes `scp`, usa Git o copia manual:
```bash
# Alternativa: Clonar desde Git
ssh usuario@servidor-instituto
cd /home/usuario
git clone <tu-repositorio>
cd lifechat
```

### 2. Conectarse al servidor
```bash
ssh usuario@servidor-instituto
cd lifechat
```

### 3. Verificar que Docker está corriendo
```bash
docker --version
docker-compose --version
sudo systemctl status docker
```

### 4. Configurar variables de entorno
```bash
cp .env.prod.example .env.prod
nano .env.prod  # o vim .env.prod
```

Actualizar:
- `SPRING_DATASOURCE_USERNAME`: usuario de PostgreSQL
- `SPRING_DATASOURCE_PASSWORD`: contraseña de PostgreSQL
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
- `FRONTEND_API_URL`: IP o dominio del servidor (ej: `http://192.168.x.x:8080`)

### 5. Dar permisos correctos
```bash
chmod 600 .env.prod  # Solo tú puedes leer credenciales
chmod +x ./lifechat_backend/mvnw  # Permitir ejecución
```

### 6. Ejecutar con el archivo de producción
```bash
# Con sudo si es necesario para Docker:
sudo docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# O si tu usuario está en el grupo docker:
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 7. Verificar que está corriendo
```bash
docker-compose -f docker-compose.prod.yml ps
```

Deberías ver:
```
NAME          IMAGE               STATUS
lifechat-backend   lifechat-backend    Up
lifechat-frontend  lifechat-frontend   Up
```

### 8. Ver logs en tiempo real
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 9. Acceder a la aplicación
```
http://<IP-servidor-linux>
ej: http://192.168.1.100
```

### 10. Detener la aplicación
```bash
docker-compose -f docker-compose.prod.yml down
```

### 11. Reiniciar después de reboot del servidor (Opcional)
Crear archivo `start-lifechat.sh`:
```bash
#!/bin/bash
cd /home/usuario/lifechat
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

Hacer ejecutable:
```bash
chmod +x start-lifechat.sh
```

Agregar a crontab para que se inicie al encender:
```bash
crontab -e
# Agregar esta línea:
@reboot /home/usuario/lifechat/start-lifechat.sh
```

## Solución de problemas en Linux

### Error: "docker: command not found"
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER  # Agregar usuario al grupo docker
# Cerrar sesión y volver a conectar
```

### Error: "No se puede conectar a PostgreSQL"
```bash
# Verificar que PostgreSQL está corriendo:
sudo systemctl status postgresql
# O:
ss -tlnp | grep 5432
```

### Ver logs detallados
```bash
docker-compose -f docker-compose.prod.yml logs backend --tail 100
```

## Notas importantes:
- ❌ NO subir `.env.prod` a Git (está en .gitignore)
- ✅ Solo subir `.env.prod.example`
- ✅ La BD PostgreSQL debe estar corriendo en `localhost:5432`
- ✅ Usar `sudo` si tu usuario no tiene permisos para Docker
- ✅ Cambiar permisos de `.env.prod` a 600 (solo lectura para el propietario)

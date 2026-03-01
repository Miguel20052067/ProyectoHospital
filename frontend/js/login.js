// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Estado del formulario
let isLoading = false;

/**
 * Inicialización cuando carga la página
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay credenciales guardadas
    checkRememberedCredentials();
    
    // Focus automático en el campo de usuario
    usernameInput.focus();
    
    console.log('Sistema de login inicializado correctamente');
});

/**
 * Toggle para mostrar/ocultar contraseña
 */
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Cambiar el ícono
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

/**
 * Manejo del envío del formulario
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Prevenir múltiples envíos
    if (isLoading) return;
    
    // Limpiar errores previos
    hideError();
    
    // Validar campos
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        showError('Por favor, completa todos los campos');
        return;
    }
    
    // Iniciar loading
    setLoading(true);
    
    try {
        // Llamada al backend para autenticación
        const result = await loginUser(username, password);
        
        if (result.success) {
            // Guardar credenciales si el usuario lo desea
            if (rememberMeCheckbox.checked) {
                saveCredentials(username);
            } else {
                clearCredentials();
            }
            
            // Mostrar mensaje de éxito
            showSuccess('Inicio de sesión exitoso. Redirigiendo...');
            
            // Redireccionar al dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } else {
            showError(result.message || 'Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        showError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
        setLoading(false);
    }
});

/**
 * Login con Google OAuth
 */
googleLoginBtn.addEventListener('click', async () => {
    try {
        // Aquí integrarías con Google OAuth 2.0
        // Por ahora es un placeholder
        showError('El inicio de sesión con Google estará disponible próximamente');
        
        // Ejemplo de implementación:
        // window.location.href = '/oauth2/authorization/google';
    } catch (error) {
        console.error('Error en Google login:', error);
        showError('Error al conectar con Google');
    }
});

/**
 * Función para autenticar usuario (llamada al backend)
 */
async function loginUser(username, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        if (!response.ok) {
            throw new Error('Error en la autenticación');
        }
        
        const data = await response.json();
        
        // Guardar token en localStorage si existe
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        console.error('Error en loginUser:', error);
        return {
            success: false,
            message: 'Error de autenticación. Verifica tus credenciales.'
        };
    }
}

/**
 * Guardar credenciales en localStorage
 */
function saveCredentials(username) {
    localStorage.setItem('rememberedUsername', username);
}

/**
 * Limpiar credenciales guardadas
 */
function clearCredentials() {
    localStorage.removeItem('rememberedUsername');
}

/**
 * Verificar si hay credenciales guardadas
 */
function checkRememberedCredentials() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        usernameInput.value = rememberedUsername;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    }
}

/**
 * Mostrar estado de carga
 */
function setLoading(loading) {
    isLoading = loading;
    loginBtn.disabled = loading;
    
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        usernameInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        usernameInput.disabled = false;
        passwordInput.disabled = false;
    }
}

/**
 * Mostrar error
 */
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    errorAlert.classList.remove('alert-success');
    errorAlert.classList.add('alert-error');
    
    // Hacer scroll al error si está fuera de vista
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccess(message) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    errorAlert.classList.remove('alert-error');
    errorAlert.classList.add('alert-success');
    errorAlert.style.background = '#e8f5e9';
    errorAlert.style.color = '#2e7d32';
    errorAlert.style.borderColor = '#c8e6c9';
}

/**
 * Ocultar alerta
 */
function hideError() {
    errorAlert.style.display = 'none';
}

/**
 * Validación en tiempo real del email
 */
usernameInput.addEventListener('blur', () => {
    const value = usernameInput.value.trim();
    
    // Si parece ser un email, validar formato
    if (value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            usernameInput.style.borderColor = 'var(--error-color)';
        } else {
            usernameInput.style.borderColor = 'var(--success-color)';
        }
    }
});

// Limpiar el borde cuando el usuario empiece a escribir de nuevo
usernameInput.addEventListener('input', () => {
    usernameInput.style.borderColor = 'var(--gray-300)';
});

/**
 * Soporte para Enter en los campos
 */
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

/**
 * Prevenir ataques de fuerza bruta (rate limiting en el cliente)
 */
let loginAttempts = 0;
const MAX_ATTEMPTS = 5;
let blockUntil = null;

function checkRateLimit() {
    if (blockUntil && Date.now() < blockUntil) {
        const remainingSeconds = Math.ceil((blockUntil - Date.now()) / 1000);
        showError(`Demasiados intentos. Espera ${remainingSeconds} segundos.`);
        return false;
    }
    
    loginAttempts++;
    
    if (loginAttempts >= MAX_ATTEMPTS) {
        blockUntil = Date.now() + 60000; // Bloquear por 1 minuto
        showError('Demasiados intentos fallidos. Espera 1 minuto.');
        return false;
    }
    
    return true;
}

// Resetear intentos después de un login exitoso
function resetLoginAttempts() {
    loginAttempts = 0;
    blockUntil = null;
}
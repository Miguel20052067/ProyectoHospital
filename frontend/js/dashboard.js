/**
 * MediConnect Dashboard
 * Evaluación de Casos Clínicos
 */

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    checkAuthentication();
});

function initializeApp() {
    setupSliders();
    setupSidebar();
    setupValidation();
    setupUserMenu();
}

// ===================================
// AUTHENTICATION CHECK
// ===================================

async function checkAuthentication() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/user', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const user = await response.json();
        
        if (user && user.authenticated) {
            displayUserInfo(user);
            console.log('✅ Usuario autenticado:', user);
        } else {
            console.log('❌ Usuario no autenticado, redirigiendo...');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // En desarrollo, comentar la siguiente línea para no redirigir
        // window.location.href = '/index.html';
    }
}

function displayUserInfo(user) {
    // Actualizar nombre de usuario
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && user.name) {
        userNameElement.textContent = user.name;
    }
    
    // Actualizar avatar
    const userAvatarElement = document.querySelector('.user-avatar');
    if (userAvatarElement && user.picture) {
        userAvatarElement.innerHTML = `<img src="${user.picture}" alt="${user.name}">`;
    } else if (userAvatarElement && user.name) {
        // Iniciales si no hay foto
        const initials = user.name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        userAvatarElement.innerHTML = `<span>${initials}</span>`;
    }
}

// ===================================
// SLIDERS SYSTEM
// ===================================

function setupSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach((slider, index) => {
        const valueDisplay = document.getElementById(`value${index + 1}`);
        
        // Actualizar el valor mostrado
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            
            // Animación del valor
            valueDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                valueDisplay.style.transform = 'scale(1)';
            }, 200);
            
            // Cambiar color según el valor
            updateValueColor(valueDisplay, value);
        });
        
        // Inicializar color
        updateValueColor(valueDisplay, slider.value);
    });
}

function updateValueColor(element, value) {
    const val = parseInt(value);
    
    // Colores según la puntuación
    if (val <= 2) {
        element.style.background = 'linear-gradient(135deg, #FF7675 0%, #E74C3C 100%)';
    } else if (val === 3) {
        element.style.background = 'linear-gradient(135deg, #FDCB6E 0%, #F39C12 100%)';
    } else {
        element.style.background = 'linear-gradient(135deg, #00B894 0%, #00D9A0 100%)';
    }
}

// ===================================
// SIDEBAR MENU
// ===================================

function setupSidebar() {
    const userButton = document.getElementById('userButton');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Abrir sidebar
    userButton.addEventListener('click', () => {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar sidebar
    const closeSidebar = () => {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

// ===================================
// USER MENU
// ===================================

function setupUserMenu() {
    const logoutButton = document.getElementById('logoutButton');
    
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            showNotification('Sesión cerrada correctamente', 'success');
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            showNotification('Error al cerrar sesión', 'error');
        }
    });
}

// ===================================
// VALIDATION BUTTON
// ===================================

function setupValidation() {
    const validateButton = document.getElementById('validateButton');
    
    validateButton.addEventListener('click', async () => {
        // Obtener todas las puntuaciones
        const ratings = {
            precision_diagnostica: parseInt(document.getElementById('rating1').value),
            claridad_textual: parseInt(document.getElementById('rating2').value),
            relevancia_clinica: parseInt(document.getElementById('rating3').value),
            adecuacion_contextual: parseInt(document.getElementById('rating4').value),
            nivel_tecnico: parseInt(document.getElementById('rating5').value)
        };
        
        // Validar que todas las puntuaciones estén completadas
        const allRated = Object.values(ratings).every(rating => rating >= 1 && rating <= 5);
        
        if (!allRated) {
            showNotification('Por favor, complete todas las puntuaciones', 'warning');
            return;
        }
        
        // Deshabilitar botón
        validateButton.disabled = true;
        validateButton.style.opacity = '0.6';
        validateButton.querySelector('span').textContent = 'Guardando...';
        
        console.log('📊 Evaluación enviada:', ratings);
        
        // Simulación de envío al backend
        try {
            // Aquí irá tu llamada al backend
            /*
            const response = await fetch('http://localhost:8080/api/cases/evaluate', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ratings)
            });
            
            if (response.ok) {
                showNotification('Caso evaluado correctamente', 'success');
                loadNextCase();
            }
            */
            
            // Simulación
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('¡Caso evaluado correctamente! 🎉', 'success');
            
            setTimeout(() => {
                loadNextCase();
            }, 1000);
            
        } catch (error) {
            console.error('Error al validar caso:', error);
            showNotification('Error al enviar la evaluación', 'error');
            validateButton.disabled = false;
            validateButton.style.opacity = '1';
            validateButton.querySelector('span').textContent = 'Validar y Siguiente Caso';
        }
    });
}

// ===================================
// LOAD NEXT CASE
// ===================================

function loadNextCase() {
    // Animación de salida
    const caseCard = document.querySelector('.case-card');
    const ratingContainer = document.querySelector('.rating-container');
    
    caseCard.style.animation = 'fadeOut 0.5s ease-out forwards';
    ratingContainer.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        // Incrementar número de caso
        const caseNumberElement = document.getElementById('caseNumber');
        const currentNumber = parseInt(caseNumberElement.textContent.replace('#', ''));
        caseNumberElement.textContent = `#${String(currentNumber + 1).padStart(3, '0')}`;
        
        // Actualizar progreso
        updateProgress(currentNumber);
        
        // Resetear sliders a valor medio (3)
        for (let i = 1; i <= 5; i++) {
            const slider = document.getElementById(`rating${i}`);
            slider.value = 3;
            document.getElementById(`value${i}`).textContent = '3';
            updateValueColor(document.getElementById(`value${i}`), 3);
        }
        
        // Cargar nuevo caso (aquí iría la llamada al backend)
        loadCaseData(currentNumber + 1);
        
        // Resetear botón
        const validateButton = document.getElementById('validateButton');
        validateButton.disabled = false;
        validateButton.style.opacity = '1';
        validateButton.querySelector('span').textContent = 'Validar y Siguiente Caso';
        
        // Animación de entrada
        caseCard.style.animation = 'fadeIn 0.5s ease-out forwards';
        ratingContainer.style.animation = 'fadeIn 0.5s ease-out 0.2s backwards';
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

function updateProgress(currentCase) {
    const totalCases = 10;
    const percentage = ((currentCase + 1) / totalCases) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressNumbers = document.querySelector('.progress-numbers');
    
    progressFill.style.width = `${percentage}%`;
    progressNumbers.textContent = `${currentCase + 1} de ${totalCases} casos`;
}

function loadCaseData(caseNumber) {
    // Simulación de carga de datos
    // En producción, aquí harías un fetch al backend
    
    const cases = [
        {
            title: 'Paciente femenina de 45 años',
            content: 'Caso clínico de ejemplo...'
        },
        {
            title: 'Paciente masculino de 62 años',
            content: 'Caso clínico de ejemplo 2...'
        }
        // Más casos...
    ];
    
    // Actualizar contenido del caso
    // const caseContent = document.getElementById('caseContent');
    // caseContent.innerHTML = generarHTMLCaso(cases[caseNumber % cases.length]);
}

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'info') {
    // Eliminar notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const colors = {
        success: '#00B894',
        error: '#FF7675',
        warning: '#FDCB6E',
        info: '#05BFDB'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${icons[type]}</span>
            <span style="font-weight: 600;">${message}</span>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        background: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(10, 77, 104, 0.2)',
        zIndex: '1000',
        borderLeft: `4px solid ${colors[type]}`,
        animation: 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    
    document.body.appendChild(notification);
    
    // Auto eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// ANIMATIONS CSS
// ===================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .rating-value {
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
`;
document.head.appendChild(style);

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para validar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('validateButton').click();
    }
    
    // Números 1-5 para cambiar rating (cuando slider está enfocado)
    if (e.key >= '1' && e.key <= '5') {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('slider')) {
            activeElement.value = e.key;
            activeElement.dispatchEvent(new Event('input'));
        }
    }
});

// ===================================
// CONSOLE BRANDING
// ===================================

console.log(
    '%c🏥 MediConnect Dashboard %c- Evaluación de Casos Clínicos',
    'color: #0A4D68; font-size: 16px; font-weight: bold;',
    'color: #5A6C7D; font-size: 14px;'
);

console.log(
    '%c📊 Atajos de teclado:%c\n' +
    '  • Ctrl/Cmd + Enter: Validar caso\n' +
    '  • ESC: Cerrar menú lateral\n' +
    '  • 1-5: Cambiar puntuación (con slider enfocado)',
    'color: #05BFDB; font-weight: bold;',
    'color: #5A6C7D;'
);
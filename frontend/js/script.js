/**
 * MediConnect - Hospital Management System
 * Login Page Interactions
 */

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    initializeAnimations();
    setupAccessibility();
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Google Sign-In Button
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
        
        // Add ripple effect on click
        googleSignInBtn.addEventListener('mousedown', createRipple);
    }

    // Contact Support Link
    const contactSupportLink = document.getElementById('contactSupport');
    if (contactSupportLink) {
        contactSupportLink.addEventListener('click', handleContactSupport);
    }

    // Logo hover effect
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', handleLogoHover);
    }
}

// ===================================
// GOOGLE SIGN-IN HANDLER
// ===================================

function handleGoogleSignIn(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    
    // Añadir estado de carga
    button.classList.add('loading');
    button.disabled = true;
    
    const originalText = button.querySelector('.btn-text').textContent;
    button.querySelector('.btn-text').textContent = 'Redirigiendo a Google...';
    
    console.log('🔐 Iniciando autenticación con Google OAuth...');
    
    // Redirigir al endpoint de OAuth de Spring Boot
    // Spring Boot se encargará de redirigir a Google automáticamente
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}

// Build Google OAuth URL (production implementation)
function buildGoogleAuthUrl() {
    const config = {
        clientId: '204187817972-co7st2n6j25bu4sdp122omi5kqmh99lq.apps.googleusercontent.com',
        redirectUri: encodeURIComponent(window.location.origin + '/auth/callback'),
        scope: 'openid email profile',
        responseType: 'code',
        accessType: 'offline'
    };
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=${config.responseType}&scope=${encodeURIComponent(config.scope)}&access_type=${config.accessType}`;
}

// ===================================
// CONTACT SUPPORT HANDLER
// ===================================

function handleContactSupport(event) {
    event.preventDefault();
    
    const supportInfo = {
        email: 'soporte@mediconnect.com',
        phone: '+34 900 123 456',
        hours: 'Lunes a Viernes, 8:00 - 20:00'
    };
    
    showSupportModal(supportInfo);
}

// ===================================
// NOTIFICATIONS & MODALS
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(10, 77, 104, 0.15)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        borderLeft: `4px solid ${getNotificationColor(type)}`
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        info: '#05BFDB',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#FF7675'
    };
    return colors[type] || colors.info;
}

function showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Autenticación de Google</h3>
                <button class="modal-close" onclick="this.closest('.auth-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="modal-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#0A4D68" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="#00B894" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <p class="modal-message">
                    <strong>Para implementar la autenticación completa:</strong><br><br>
                    1. Configura OAuth 2.0 en Google Cloud Console<br>
                    2. Obtén tu Client ID<br>
                    3. Implementa el callback de autenticación<br><br>
                    Esta es una vista previa del diseño.
                </p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn" onclick="this.closest('.auth-modal').remove()">Entendido</button>
            </div>
        </div>
    `;
    
    applyModalStyles(modal);
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

function showSupportModal(supportInfo) {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Soporte Técnico</h3>
                <button class="modal-close" onclick="this.closest('.support-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="support-item">
                    <span class="support-icon">📧</span>
                    <div>
                        <strong>Email</strong>
                        <p>${supportInfo.email}</p>
                    </div>
                </div>
                <div class="support-item">
                    <span class="support-icon">📞</span>
                    <div>
                        <strong>Teléfono</strong>
                        <p>${supportInfo.phone}</p>
                    </div>
                </div>
                <div class="support-item">
                    <span class="support-icon">🕐</span>
                    <div>
                        <strong>Horario</strong>
                        <p>${supportInfo.hours}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn" onclick="this.closest('.support-modal').remove()">Cerrar</button>
            </div>
        </div>
    `;
    
    applyModalStyles(modal);
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
}

function applyModalStyles(modal) {
    const styles = `
        <style>
            .auth-modal, .support-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-out;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(6, 44, 61, 0.7);
                backdrop-filter: blur(4px);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(10, 77, 104, 0.3);
                animation: slideUp 0.3s ease-out;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid #E5E9ED;
            }
            
            .modal-header h3 {
                font-family: 'Crimson Pro', serif;
                font-size: 24px;
                font-weight: 700;
                color: #0A4D68;
            }
            
            .modal-close {
                width: 32px;
                height: 32px;
                border: none;
                background: #F8FAFB;
                border-radius: 8px;
                font-size: 24px;
                color: #5A6C7D;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: #E5E9ED;
                color: #1A2332;
            }
            
            .modal-body {
                padding: 32px 24px;
            }
            
            .modal-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
            }
            
            .modal-icon svg {
                width: 100%;
                height: 100%;
            }
            
            .modal-message {
                text-align: center;
                color: #5A6C7D;
                line-height: 1.8;
            }
            
            .modal-message strong {
                color: #1A2332;
            }
            
            .support-item {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 16px;
                background: #F8FAFB;
                border-radius: 12px;
                margin-bottom: 12px;
            }
            
            .support-icon {
                font-size: 28px;
            }
            
            .support-item strong {
                display: block;
                color: #0A4D68;
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .support-item p {
                color: #5A6C7D;
                font-size: 14px;
            }
            
            .modal-footer {
                padding: 16px 24px;
                border-top: 1px solid #E5E9ED;
                display: flex;
                justify-content: flex-end;
            }
            
            .modal-btn {
                padding: 12px 32px;
                background: #0A4D68;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-btn:hover {
                background: #062C3D;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(10, 77, 104, 0.3);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;
    
    modal.insertAdjacentHTML('beforeend', styles);
}

// ===================================
// RIPPLE EFFECT
// ===================================

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple-effect');
    
    const rippleElement = button.querySelector('.ripple-effect');
    if (rippleElement) {
        rippleElement.remove();
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(5, 191, 219, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
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
`;
document.head.appendChild(rippleStyles);

// ===================================
// LOGO HOVER EFFECT
// ===================================

function handleLogoHover() {
    const logoIcon = document.querySelector('.logo-icon');
    if (logoIcon) {
        logoIcon.style.animation = 'none';
        setTimeout(() => {
            logoIcon.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
    }
}

// ===================================
// ANIMATIONS
// ===================================

function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.feature-card, .trust-badge');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// ACCESSIBILITY
// ===================================

function setupAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', (event) => {
        // ESC key closes modals
        if (event.key === 'Escape') {
            const modal = document.querySelector('.auth-modal, .support-modal');
            if (modal) {
                modal.remove();
            }
        }
        
        // Enter key on focused button triggers click
        if (event.key === 'Enter' && event.target.tagName === 'BUTTON') {
            event.target.click();
        }
    });
    
    // Add skip to main content link for screen readers
    addSkipLink();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    
    Object.assign(skipLink.style, {
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#0A4D68',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: '10000'
    });
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        rightPanel.id = 'main-content';
    }
}

// ===================================
// CONSOLE BRANDING
// ===================================

console.log(
    '%c🏥 MediConnect %c- Sistema de Gestión Hospitalaria',
    'color: #0A4D68; font-size: 16px; font-weight: bold;',
    'color: #5A6C7D; font-size: 14px;'
);

console.log(
    '%c💡 Desarrollado con pasión por la salud digital',
    'color: #05BFDB; font-style: italic;'
);
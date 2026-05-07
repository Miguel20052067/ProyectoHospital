const loginForm = document.getElementById('loginForm');
const loginFeedback = document.getElementById('loginFeedback');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = String(formData.get('email') || '').trim();

        if (email) {
            localStorage.setItem('primaria_user_email', email);
        }

        loginFeedback.textContent = `Acceso validado para ${email}. Redirigiendo al panel clínico.`;
        loginFeedback.classList.remove('hidden');

        window.setTimeout(() => {
            window.location.href = './pages/casos.html';
        }, 350);
    });
}

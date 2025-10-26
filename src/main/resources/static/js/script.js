const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const checkbox = document.getElementById("checkbox");
const errorDiv = document.getElementById("error");

// Mostrar contraseña
checkbox.addEventListener('click', () => {
    passwordInput.type = checkbox.checked ? "text" : "password";
});

// Enviar login al backend
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que la página recargue

    const email = document.getElementById("name").value;
    const password = passwordInput.value;

    try {
        const response = await fetch("http://localhost:8001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Bienvenido: ${data.email}`);
            // Aquí podrías redirigir a otra página
            // window.location.href = "/dashboard.html";
        } else {
            errorDiv.textContent = data.message || "Error en login";
        }
    } catch (err) {
        console.error(err);
        errorDiv.textContent = "No se pudo conectar al servidor";
    }
    const data = await response.json();
    console.log(data);

});

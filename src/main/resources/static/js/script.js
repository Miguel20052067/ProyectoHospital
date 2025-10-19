const password = document.getElementById("password");
const checkbox = document.getElementById("checkbox");

//Mostrar contraseña
checkbox.addEventListener('click', ()=> {
    if (checkbox.checked) {
        password.type = "text"; 
    }else{
        password.type = "password"
    }
})


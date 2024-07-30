document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Obtener valores de los campos
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    fetch('data/users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => 
                (u.username === usernameInput || u.email === usernameInput) && u.password === passwordInput
            );

            if (user) {
                // Guardar usuario autenticado y redirigir
                setAuthenticatedUser(user.username);
                window.location.href = 'dashboard.html';
            } else {
                // Mostrar mensaje de error
                errorMessage.textContent = 'Usuario o contraseña incorrectos';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error al leer el archivo JSON:', error);
            errorMessage.textContent = 'Error al intentar iniciar sesión. Intente nuevamente más tarde.';
            errorMessage.style.display = 'block';
        });
});
document.querySelector('.form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            // Aquí puedes guardar el token en el almacenamiento local o en cookies
            localStorage.setItem('token', result.token);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al iniciar sesión.');
    }
});
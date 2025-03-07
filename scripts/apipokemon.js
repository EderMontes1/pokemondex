import config from '../config.js'

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el token JWT desde localStorage (suponiendo que ya lo tienes guardado allí)
    const token = localStorage.getItem('token');

    // Si no hay token, redirigir a la página de login o mostrar un error
    if (!token) { 
        console.error('No token found. Please log in.');
        return;
    }

    // Obtener el nombre de usuario desde el servidor
    const getUsernameFromServer = async () => {
        try {
            /* const response = await fetch('http://localhost:5000/api/auth/user', { */
               const response = await fetch(`${config.apiUrl}/api/auth/user`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Enviamos el token en el header
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching username from server');
            }

            const data = await response.json();
            localStorage.setItem('username', data.username); // Almacenar el nombre de usuario en localStorage
            return data.username; // Retornamos el nombre de usuario
        } catch (error) {
            console.error('Error fetching username:', error);
            return 'Error'; // Si hay un error, mostramos "Error"
        }
    };

    // Cargar el nombre de usuario y actualizar el DOM
    const username = await getUsernameFromServer();
    document.getElementById('username').textContent = username; // Actualizamos el nombre de usuario en el DOM



    // Initial fetch
    await fetchPokemon();

    

});
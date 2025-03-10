const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
    // Eliminar token y username de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirigir al login
    window.location.href = 'https://pokemondex-nine.vercel.app/login.html';
});
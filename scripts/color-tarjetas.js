document.addEventListener('DOMContentLoaded', () => {
    const pokemonListContainer = document.getElementById('pokemon-list');

    pokemonListContainer.addEventListener('change', (event) => {
        // Verificamos si el cambio fue en un checkbox de capturado o shiny
        if (event.target.matches('.pokemon-normal, .pokemon-shiny')) {
            // Encontramos el div más cercano que contiene el checkbox
            const card = event.target.closest('.card-pokemon');
            
            // Comprobamos si la casilla de verificación está activada o no
            if (event.target.checked) {
                // Cambiamos el color de fondo dependiendo del tipo de casilla
                card.style.backgroundColor = event.target.classList.contains('pokemon-normal') ? '#6af894' : '#f7c0c0';
            } else {
                // Si no está activada, restauramos el color de fondo original
                card.style.backgroundColor = '#f7c0c0'; // O cualquier otro color que prefieras como "normal"
            }
        }
    });
});

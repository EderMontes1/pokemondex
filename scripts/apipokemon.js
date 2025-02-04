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
        const response = await fetch('http://localhost:5000/api/auth/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Enviamos el token en el header
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching username from server');
        }

        const data = await response.json();
        return data.username; // Retornamos el nombre de usuario
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'Error'; // Si hay un error, mostramos "Error"
    }
};

// Cargar el nombre de usuario y actualizar el DOM
const username = await getUsernameFromServer();
document.getElementById('username').textContent = username; // Actualizamos el nombre de usuario en el DOM



    // Fetch Pokemon list from API
    const fetchPokemon = async () => {
        try {
            const responseGen1 = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151'); // Ajusta para diferentes generaciones
            const pokemonList = responseGen1.data.results;

            // Obtener los primeros 100 Pokémon de la segunda generación
            // const responseGen2 = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=151&limit=100');
            // const pokemonListGen2 = responseGen2.data.results;


            // Unir ambas listas y pasarla a la función de renderizado
            const combinedPokemonList = [...pokemonList];

            renderPokemonList(combinedPokemonList);
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        }
    };
 // Renderizar la lista de Pokémon en el grid
 const renderPokemonList = (pokemonList) => {
    const pokemonListContainer = document.getElementById('pokemon-list');
    pokemonListContainer.innerHTML = '';

    pokemonList.forEach((pokemon, index) => {
        // Crear separación entre generaciones
        if (index === 151) {
            const separator = document.createElement('div');
            separator.className = 'w-full my-4 text-center';
            separator.innerHTML = '<hr><h2 class="font-bold text-lg mt-2">Segunda Generación</h2><hr>';
            pokemonListContainer.appendChild(separator);
        }

        // Crear las tarjetas de Pokémon
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'p-4 border border-gray-300 rounded-lg shadow-sm text-center';
        pokemonCard.innerHTML = `
            <p class="font-bold">#${index + 1} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png" alt="${pokemon.name}" class="w-16 h-16 mx-auto">
            <input type="checkbox" id="pokemon-${index + 1}" class="mt-2"> Captured
            <input type="checkbox" id="pokemon-${index + 1}" class="mt-2"> Shiny
        `;
        pokemonListContainer.appendChild(pokemonCard);
    });
};

    // Initial fetch
    await fetchPokemon();
});
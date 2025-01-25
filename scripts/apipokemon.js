document.addEventListener('DOMContentLoaded', async () => {
    const username = 'ExampleUser'; // Replace with actual username from server
    document.getElementById('username').textContent = username;

    // Fetch Pokemon list from API
    const fetchPokemon = async () => {
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151'); // Ajusta para diferentes generaciones
            const pokemonList = response.data.results;
            renderPokemonList(pokemonList);
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        }
    };

    // Render Pokemon list in the grid
    const renderPokemonList = (pokemonList) => {
        const pokemonListContainer = document.getElementById('pokemon-list');
        pokemonListContainer.innerHTML = '';
        pokemonList.forEach((pokemon, index) => {
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
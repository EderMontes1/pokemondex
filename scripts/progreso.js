import config from '../config.js';

const generations = {
    'Blue': 151,
    'Red': 151,
    'Yellow': 151,
    'Gold': 251,
    'Silver': 251,
    'Cristal': 251,
    // Añadir futuras generaciones aquí
};

// Elementos del DOM
const gameEditionSelect = document.getElementById('gameEditionSelect');
const progressTableBody = document.getElementById('progress-table-body');

// Event Listeners
gameEditionSelect.addEventListener('change', handleEditionChange);

// ==================== Funciones principales ====================
async function handleEditionChange(e) {
    const edition = e.target.value;
    if (edition) { // Verifica que se haya seleccionado una opción válida
        await loadGameProgress(edition);
    }
}

async function loadGameProgress(edition) {
    try {
        const progressData = await fetchProgressData(edition); // Llama a tu backend
        renderProgressTable(progressData);
        renderPokemonList(progressData.capturedPokemonList, progressData.capturedPokemonShinyList); // Renderiza la lista de Pokémon capturados
    } catch (error) {
        if (error.status === 400 || error.status === 404) {
            await createNewProgress(edition);
        } else {
            console.error('Error loading game progress:', error);
        }
    }
}

// ==================== Renderizado ====================
function renderProgressTable(data) {
    progressTableBody.innerHTML = `
        <tr>
            <td>${data.gameEdition}</td>
            <td><input type="date" id="startDate" value="${data.startDate.split('T')[0]}" onchange="handleDateChange()"></td>
            <td><input type="date" id="endDate" value="${data.endDate.split('T')[0]}" onchange="handleDateChange()"></td>
            <td>${data.totalDays}</td>
            <td><input type="number" id="hoursPlayed" value="${data.hoursPlayed.toFixed(2)}" step="0.01" onchange="handleHoursPlayedChange()"></td>
            <td>${data.realDays}</td>
            <td>${data.averageHoursPerDay.toFixed(2)}</td>
            <td>${data.capturedPokemon}</td>
            <td>${data.capturedPercentage.toFixed(2)}%</td>
            <td>${data.capturedPokemonShiny}</td>
        </tr>
    `;
}

async function renderPokemonList(capturedPokemonList, capturedPokemonShinyList) {
    const pokemonListContainer = document.getElementById('pokemon-list');
    pokemonListContainer.innerHTML = '';

    const edition = gameEditionSelect.value;
    const totalPokemon = generations[edition] || 151; // Ajuste según la generación

    for (let i = 1; i <= totalPokemon; i++) {
        const pokemonData = await fetchPokemonData(i);
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'card-pokemon';

        // Establecemos el color de fondo según si está capturado o shiny
        if (capturedPokemonList.includes(i)) {
            pokemonCard.style.backgroundColor = '#6af894';  // Color verde claro para capturado normal
        } else {
            pokemonCard.style.backgroundColor = '#f7c0c0';  // Color blanco para Pokémon no capturados
        }

        pokemonCard.innerHTML = `
            <p class="font-bold">#${i} ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</p>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" alt="${pokemonData.name}" class="sprites-pokemon">
            <input type="checkbox" id="pokemon-${i}" class="pokemon-normal" ${capturedPokemonList.includes(i) ? 'checked' : ''} onclick="capturePokemon(${i}, this.checked, false)"> Capturado
            <input type="checkbox" id="pokemon-shiny-${i}" class="pokemon-shiny" ${capturedPokemonShinyList.includes(i) ? 'checked' : ''} onclick="capturePokemon(${i}, this.checked, true)"> Shiny
        `;
        pokemonListContainer.appendChild(pokemonCard);
    }
}

async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error('Error fetching Pokémon data');
    return response.json();
}

// ==================== Comunicación con Backend ====================
async function fetchProgressData(edition) {
    const username = localStorage.getItem('username'); // Asegúrate de que el username está almacenado en localStorage
    if (!username) {
        console.error('Username is not available in localStorage');
        return;
    }
    const response = await fetch(`${config.apiUrl}/api/progress?username=${username}&gameEdition=${edition}`,  { 
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (!response.ok) throw response;
    return response.json();
}

async function createNewProgress(edition) {
    const username = localStorage.getItem('username'); // Asegúrate de que el username está almacenado en localStorage
    if (confirm(`¿Quieres empezar a trackear ${edition}?`)) {
        const response = await fetch(`${config.apiUrl}/api/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ username, gameEdition: edition }) // Pasa el username correcto
        });

        if (!response.ok) throw response;
        
        await loadGameProgress(edition);
    }
}

// Asegúrate de que capturePokemon esté disponible en el ámbito global
window.capturePokemon = async function capturePokemon(pokemonId, captured, shiny) {
    const username = localStorage.getItem('username');
    const edition = gameEditionSelect.value;
    const response = await fetch(`${config.apiUrl}/api/progress/capture`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, gameEdition: edition, pokemonId, captured, shiny })
    });

    if (!response.ok) throw response;

    const progressData = await response.json();
    renderProgressTable(progressData);
};

window.handleHoursPlayedChange = async function handleHoursPlayedChange() {
    const edition = gameEditionSelect.value;
    const hoursPlayed = parseFloat(document.getElementById('hoursPlayed').value);

    if (edition && !isNaN(hoursPlayed)) {
        await updateHoursPlayed(edition, hoursPlayed);
        await loadGameProgress(edition);
    }
}

// Añadimos la función updateHoursPlayed
async function updateHoursPlayed(edition, hoursPlayed) {
    const username = localStorage.getItem('username');
    const response = await fetch(`${config.apiUrl}/api/progress/hours`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, gameEdition: edition, hoursPlayed })
    });

    if (!response.ok) throw response;

    const progressData = await response.json();
    renderProgressTable(progressData);
}

window.handleDateChange = async function handleDateChange() {
    const edition = gameEditionSelect.value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (edition && startDate && endDate) {
        await updateGameDates(edition, startDate, endDate);
        await loadGameProgress(edition);
    }
}

// Añadimos la función updateGameDates
async function updateGameDates(edition, startDate, endDate) {
    const username = localStorage.getItem('username');
    const response = await fetch(`${config.apiUrl}/api/progress/dates`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, gameEdition: edition, startDate, endDate })
    });

    if (!response.ok) throw response;

    const progressData = await response.json();
    renderProgressTable(progressData);
}

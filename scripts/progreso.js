// import { fetchPokemonData } from './apipokemon.js'; // Asumiendo que exportas funciones en tu API

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
            <td>${formatDate(data.startDate)}</td>
            <td>${formatDate(data.endDate)}</td>
            <td>${data.totalDays}</td>
            <td>${data.hoursPlayed}</td>
            <td>${data.realDays}</td>
            <td>${data.averageHoursPerDay.toFixed(2)}</td>
            <td>${data.capturedPokemon}</td>
            <td>${data.capturedPercentage.toFixed(2)}%</td>
            <td>${data.capturedPokemonShiny}</td>
        </tr>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// ==================== Comunicación con Backend ====================
async function fetchProgressData(edition) {
    const username = localStorage.getItem('username'); // Asegúrate de que el username está almacenado en localStorage
    if (!username) {
        console.error('Username is not available in localStorage');
        return;
    }
    const response = await fetch(`http://localhost:5000/api/progress?username=${username}&gameEdition=${edition}`, {
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
        const response = await fetch('http://localhost:5000/api/progress', {
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
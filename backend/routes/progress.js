const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Asegúrate de que la ruta al modelo User sea correcta

// Ruta para crear/obtener el progreso de una edición
router.post('/', async (req, res) => {
    const { username, gameEdition, startDate, endDate } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Verificar si ya existe progreso para esta edición
    let progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);

    if (!progreso) {
        // Crear nuevo progreso
        progreso = {
            gameEdition,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            hoursPlayed: 0,
            capturedPokemon: 0,
            capturedPokemonShiny: 0,
            capturedPokemonList: [],
            capturedPokemonShinyList: [],
        };
        usuario.pokemonProgress.push(progreso);
        await usuario.save();
    }

    res.json(progreso);
});

// Ruta para obtener el progreso de una edición
router.get('/', async (req, res) => {
    const { username, gameEdition } = req.query;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);
    if (!progreso) return res.status(404).json({ error: "Progreso no encontrado" });

    res.json(progreso);
});

// Ruta para actualizar los Pokémon capturados
router.put('/capture', async (req, res) => {
    const { username, gameEdition, pokemonId, captured, shiny } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);
    if (!progreso) return res.status(404).json({ error: "Progreso no encontrado" });

    if (shiny) {
        if (captured) {
            if (!progreso.capturedPokemonShinyList.includes(pokemonId)) {
                progreso.capturedPokemonShinyList.push(pokemonId);
            }
        } else {
            progreso.capturedPokemonShinyList = progreso.capturedPokemonShinyList.filter(id => id !== pokemonId);
        }
        progreso.capturedPokemonShiny = progreso.capturedPokemonShinyList.length;
    } else {
        if (captured) {
            if (!progreso.capturedPokemonList.includes(pokemonId)) {
                progreso.capturedPokemonList.push(pokemonId);
            }
        } else {
            progreso.capturedPokemonList = progreso.capturedPokemonList.filter(id => id !== pokemonId);
        }
        progreso.capturedPokemon = progreso.capturedPokemonList.length;
        progreso.capturedPercentage = (progreso.capturedPokemon / 151) * 100;
    }

    await usuario.save();
    res.json(progreso);
});

// Ruta para actualizar las fechas de inicio y fin
router.put('/dates', async (req, res) => {
    const { username, gameEdition, startDate, endDate } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);
    if (!progreso) return res.status(404).json({ error: "Progreso no encontrado" });

    progreso.startDate = new Date(startDate);
    progreso.endDate = new Date(endDate);
    progreso.totalDays = Math.ceil((progreso.endDate - progreso.startDate) / (1000 * 60 * 60 * 24));

    await usuario.save();
    res.json(progreso);
});

// Ruta para actualizar las horas jugadas
router.put('/hours', async (req, res) => {
    const { username, gameEdition, hoursPlayed } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);
    if (!progreso) return res.status(404).json({ error: "Progreso no encontrado" });

    progreso.hoursPlayed = hoursPlayed;
    progreso.realDays = Math.ceil(hoursPlayed / 24);
    progreso.averageHoursPerDay = progreso.totalDays > 0 ? hoursPlayed / progreso.totalDays : 0;

    await usuario.save();
    res.json(progreso);
});

module.exports = router;

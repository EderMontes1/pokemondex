const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Asegúrate de que la ruta al modelo User sea correcta

// Ruta para crear/obtener el progreso de una edición
router.post('/', async (req, res) => {
    const { username, gameEdition } = req.body;

    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Verificar si ya existe progreso para esta edición
    let progreso = usuario.pokemonProgress.find(p => p.gameEdition === gameEdition);

    if (!progreso) {
        // Crear nuevo progreso
        progreso = {
            gameEdition,
            startDate: new Date(),
            endDate: new Date(),
            hoursPlayed: 0,
            capturedPokemon: 0,
            capturedPokemonShiny: 0,
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

module.exports = router;

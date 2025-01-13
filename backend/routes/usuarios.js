const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Importa el modelo de usuario

// Ruta para registrar un nuevo usuario
router.post('/registrar', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verifica si el nombre de usuario ya existe
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
        }
        
        // Verifica si el email ya existe
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "El email ya está en uso." });
        }

        // Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password
        });

        // Guardar el usuario en la base de datos
        await newUser.save();
        
        // Responder al frontend
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
});

module.exports = router;

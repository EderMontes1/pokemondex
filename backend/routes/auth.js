require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Verificar si JWT_SECRET está configurado correctamente
if (!JWT_SECRET) {
    console.error('JWT_SECRET no está definido en las variables de entorno');
    process.exit(1); // Detén la ejecución si falta el secreto
}

// ** Ruta de registro de usuario **
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Validar entrada del usuario
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    try {
        // Verificar si el nombre de usuario o correo ya existen
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        // Crear y guardar el nuevo usuario
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar usuario:', err.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// ** Ruta de login de usuario **
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validar entrada del usuario
    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos' });
    }

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
        }

        // Comparar la contraseña ingresada con la almacenada
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Las contraseñas no coinciden');
            return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Log de éxito de login
        console.log(`Usuario ${username} logueado con éxito`);

        // Enviar el token al cliente
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});



// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtenemos el token del header
    if (!token) return res.sendStatus(401); // Si no hay token, respondemos con 401

    jwt.verify(token, JWT_SECRET, (err, user) => { // Verificamos el token
        if (err) return res.sendStatus(403); // Si el token es inválido, respondemos con 403
        req.user = user; // Si el token es válido, asignamos el usuario a la request
        next();
    });
};

// Endpoint para obtener los datos del usuario autenticado
router.get('/user', authenticateToken, async (req, res) => {
    try {
        // Buscamos al usuario por el ID que está en el payload del token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ username: user.username }); // Devolvemos el nombre de usuario
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;

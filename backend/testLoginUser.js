require('dotenv').config(); // Cargar variables de entorno desde .env
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Solicita la conexion a la base de datos
const User = require('./models/user'); // Importa el modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const loginUsuario = async () => {
    try {
        // Conecta con la base de datos
        await connectDB();

        // Datos de prueba para el login
       /*  const username = "GaryOak";
        const password = "eevee123"; */

          // Datos de prueba para el login
       const username = "paleto2";
        const password = "pika1234"; 

        // Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Usuario no encontrado');
            return;
        }

        // Comparar la contraseña ingresada con la almacenada
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Las contraseñas no coinciden');
            return;
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Mostrar el token
        console.log('Inicio de sesión exitoso. Token:', token);
    } catch (err) {
        console.error("Error al iniciar sesión:", err.message);
    } finally {
        // Cierra la conexión con la base de datos
        mongoose.connection.close();
    }
};

loginUsuario();
// crearUsuario.js

require('dotenv').config(); // Cargar variables de entorno desde .env
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Solicita la conexion a la base de datos
const User = require('./models/user'); // Importa el modelo de usuario

const crearUsuario = async () => {
    try {
        // Conecta con la base de datos
        await connectDB();

        // Crea un nuevo usuario
        const nuevoUsuario = new User({
            username: "paleto2",
            password: "pika1234",
            email:"testpruebassssss@gmail.com",
            pokemonProgress: [],
        });

        // Guarda el usuario en la base de datos
        await nuevoUsuario.save();
        console.log("Usuario creado con éxito");
    } catch (err) {
        console.error("Error al crear el usuario:", err.message);
    } finally {
        // Cierra la conexión con la base de datos
        mongoose.connection.close();
    }
};

crearUsuario();

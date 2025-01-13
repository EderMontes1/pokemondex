const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');  // Para parsear los datos del cuerpo de la solicitud
const usuarioRoutes = require('./routes/usuarios');  // Importa las rutas de usuario

const app = express();

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/pokemon_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Conexión exitosa a la base de datos");
}).catch((err) => {
    console.log("Error al conectar a la base de datos:", err);
});

// Middleware
app.use(cors());  // Habilitar CORS
app.use(bodyParser.json());  // Para parsear los datos JSON del cuerpo de la solicitud

// Usar las rutas de usuario
app.use('/api/usuarios', usuarioRoutes);  // Prefix a todas las rutas del archivo 'usuarios.js'

// Puerto del servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

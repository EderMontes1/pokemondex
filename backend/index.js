require('dotenv').config();
const express = require('express'); //Importa el módulo express
const cors = require('cors'); //Importa el módulo cors para manejar CORS. Permite que el servidor acepte solicitudes desde otros dominios o aplicaciones, como un frontend que se ejecuta en un navegador.

const connectDB = require('./config/db'); //Importa la función de conexión a la base de datos
const authRoutes = require('./routes/auth'); //Importa las rutas de autenticación del usuario
const progressRoutes = require('./routes/progress'); //Importa las rutas de progreso del usuario.

const app = express(); //Crea una instancia de express
const PORT = process.env.PORT || 5000;      //Define el puerto en el que se ejecutará la aplicación

// Conectar a la base de datos de MongoDB
connectDB();

// Middleware para manejar CORS y JSON
app.use(cors()); //Permite el acceso desde otros lugares (dominios) a tu aplicación.
app.use(express.json()); //Abre y organiza los datos que llegan a tu aplicación en formato JSON.

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes); // Usar las rutas de progreso

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

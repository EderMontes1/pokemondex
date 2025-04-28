/* Este archivo configura la conexion con MongoDB */
const mongoose = require('mongoose'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { //Espera a que la operación de conexión a la base de datos termine antes de continuar con el resto del código y Llama a la función connect de mongoose para establecer una conexión con MongoDB.
            
        });
        console.log('MongoDB conectado a pokemondex');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB; //Exporta la función connectDB para que pueda ser utilizada en otros archivos.

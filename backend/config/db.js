/* Este archivo configura la conexion con MongoDB */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pokemon_tracker');
            
        console.log('MongoDB conectado a pokemon_tracker');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;


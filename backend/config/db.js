/* Este archivo configura la conexion con MongoDB */
/* import mongoose from 'mongoose'; */
const mongoose = require('mongoose'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado a pokemondex');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

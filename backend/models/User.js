const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define el esquema del usuario
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pokemonProgress: [
        {
            gameEdition: String,
            startDate: Date,
            endDate: Date,
            totalDays: Number,
            hoursPlayed: Number,
            realDays: Number,
            averageHoursPerDay: Number,
            capturedPokemon: Number,
            capturedPercentage: Number,
            capturedPokemonShiny: Number,
        },
    ],
}, {
    timestamps: true,
});

// Middleware para cifrar la contraseña antes de guardarla en la base de datos
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Solo cifrar si la contraseña ha sido modificada

    try {
        // Generar un salt
        const salt = await bcrypt.genSalt(10); // Puedes ajustar el número si quieres más seguridad
        // Cifrar la contraseña antes de guardarla
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Contraseña cifrada antes de guardar:', this.password);
        next();
    } catch (err) {
        next(err); // Si hay un error en el proceso de hashing, pasa el error al siguiente middleware
    }
});

// Aquí se crea el modelo de usuario
module.exports = mongoose.model('user', UserSchema);

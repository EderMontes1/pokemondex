/* Modelo de usuario */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:{type: String, required:true},
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
});


/* Cifrar Contraseña */

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);

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
            gameEdition: String, //La edicion del juego (se introduce con un select)
            startDate: Date, //La fecha en la que el usuario comenzo a jugar (Se introduce Manual)
            endDate: Date, //La fecha en la que el usuario finalizo de jugar (Se introduce Manual)
            totalDays: Number, //Total de dias jugados endDate- StartDate (Se calcula automaticamente)
            hoursPlayed: Number, //Total de horas jugadas (Se introduce manual)
            realDays: Number,   //Total de dias jugados en la vida real (hoursPlayed/24) (Se calcula automaticamente)
            averageHoursPerDay: Number, //Promedio de horas jugadas por dia (hoursPlayed/realDays) (Se calcula automaticamente)
            capturedPokemon: Number, //Total de pokemon capturados (Se cuenta cada pokemon capturado en el listado pokemon (apioficial))
            capturedPercentage: Number,     //Porcentaje de pokemon capturados (capturedPokemon/151) (Se calcula automaticamente)   
            capturedPokemonShiny: Number,   //Total de pokemon shiny capturados (Se cuenta cada pokemon shiny capturado en el listado pokemon (apioficial))        
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

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importa bcryptjs para cifrar contraseñas

// Define el esquema del usuario
const UserSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,        // Elimina espacios en blanco al inicio/final
        minlength: 4,      // Longitud mínima de 4 caracteres
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,   // Guarda el email en minúsculas
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingresa un email válido'],
    },
    password: {
        type: String,
        required: true,
        minlength: 3,      // Longitud mínima de 3 caracteres
    },
    pokemonProgress: [ //Define un campo que es una lista (arreglo) de objetos. Cada objeto representa el progreso del usuario en una edición del juego.
        {
            gameEdition: { 
                type: String,
                required: true,
            },  // La edición del juego (se introduce con un select)
            
            startDate: {
                type: Date,
                required: true,
            },  // Fecha en la que el usuario comenzó a jugar (se introduce manual)
            
            endDate: {
                type: Date,
                required: true,
                validate: {
                    validator: function(value) {
                        return value >= this.startDate;
                    },
                    message: 'La fecha de finalización debe ser posterior a la fecha de inicio.',
                },
            },  // Fecha en la que el usuario finalizó de jugar (se introduce manual)
            
            hoursPlayed: {
                type: Number,
                required: true,
                min: 0,
            },  // Total de horas jugadas (se introduce manual)
            
            totalDays: {
                type: Number,
                default: function() {
                    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
                },
            },  // Total de días jugados (endDate - startDate) - Se calcula automáticamente
            
            realDays: {
                type: Number,
                default: function() {
                    return Math.ceil(this.hoursPlayed / 24);
                },
            },  // Total de días jugados en la vida real (hoursPlayed/24) - Se calcula automáticamente
            
            averageHoursPerDay: {
                type: Number,
                default: function() {
                    return this.realDays > 0 ? this.hoursPlayed / this.realDays : 0;
                },
            },  // Promedio de horas jugadas por día (hoursPlayed/realDays) - Se calcula automáticamente
            
            capturedPokemon: {
                type: Number,
                default: 0,
                min: 0,
            },  // Total de Pokémon capturados (se cuenta cada captura) - Se actualiza manual
            
            capturedPercentage: {
                type: Number,
                default: 0,
             
            },  // Porcentaje de captura (capturedPokemon/numero de pokemon) - Se calcula automáticamente
            
            capturedPokemonShiny: {
                type: Number,
                default: 0,
                min: 0,
            },  // Total de Pokémon shiny capturados - Se actualiza manual

            capturedPokemonList: {
                type: [Number], // Lista de IDs de Pokémon capturados
                default: [],
            }, // Lista de Pokémon capturados - Se actualiza manualmente

            capturedPokemonShinyList: {
                type: [Number], // Lista de IDs de Pokémon Shiny capturados
                default: [],
            }, // Lista de Pokémon Shiny capturados - Se actualiza manualmente
        },
    ],
}, {
    timestamps: true,  // Agrega campos createdAt y updatedAt automáticamente
});

// Middleware para cifrar la contraseña antes de guardarla
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Solo cifra si la contraseña ha sido modificada

    try {
        const salt = await bcrypt.genSalt(10); // Genera un "salt" (valor aleatorio) para hacer la contraseña más segura
        this.password = await bcrypt.hash(this.password, salt); // Cifra la contraseña usando el "salt"
        next(); // Continúa con el guardado del usuario
    } catch (err) {
        next(err); // Maneja errores si algo falla durante el cifrado
    }
});

// Exporta el modelo de usuario
module.exports = mongoose.model('user', UserSchema);
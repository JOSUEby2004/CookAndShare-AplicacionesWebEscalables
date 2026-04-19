const mongoose = require('mongoose');

// Esquema del Usuario
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true, // Evita tener correos duplicados
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        enum: ['admin', 'usuario'], // Restringimos los valores permitidos
        default: 'usuario'
    },
    foto_perfil: {
        type: String,
        default: '/img/default_user.png' // Imagen por defecto
    }
}, {
    // Esto agrega automáticamente 'createdAt' y 'updatedAt'
    timestamps: true 
});

// Compilamos el esquema en un modelo y lo exportamos
const User = mongoose.model('User', userSchema);

module.exports = User;
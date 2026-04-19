const mongoose = require('mongoose');

// Sub-esquema para los pasos
const stepSchema = new mongoose.Schema({
    orden: { 
        type: Number, 
        required: true 
    },
    instruccion: { 
        type: String, 
        required: true 
    }
}, { _id: false }); // Apagamos el _id interno para no saturar la base de datos con IDs innecesarios en cada paso

// Esquema principal de la Receta
const recipeSchema = new mongoose.Schema({
    // Así se hace una "Llave Foránea" (Relación) en Mongoose
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    titulo: {
        type: String,
        required: [true, 'El título de la receta es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    categoria: {
        type: String,
        required: true,
        enum: ['postres', 'bebidas', 'platos-principales', 'entradas']
    },
    imagen: {
        type: String,
        default: '/img/logo.png'
    },
    estado: {
        type: String,
        enum: ['aprobada', 'pendiente', 'rechazada'],
        default: 'pendiente'
    },
    // Embebemos los ingredientes como un arreglo de textos
    ingredientes: {
        type: [String], 
        required: true,
        validate: [v => v.length > 0, 'Debes incluir al menos un ingrediente']
    },
    // Embebemos los pasos usando el sub-esquema que creamos arriba
    pasos: {
        type: [stepSchema], 
        required: true,
        validate: [v => v.length > 0, 'Debes incluir al menos un paso de preparación']
    }
}, {
    timestamps: true // Automáticamente maneja 'created_at' y 'updated_at'
});

// Compilamos y exportamos el modelo
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    receta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    texto: {
        type: String,
        required: [true, 'El comentario no puede estar vacío']
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
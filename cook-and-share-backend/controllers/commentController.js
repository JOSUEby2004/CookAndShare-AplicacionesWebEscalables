const Comment = require('../models/Comment');

// Publicar un comentario
const crearComentario = async (req, res) => {
    try {
        const { recetaId, texto } = req.body;
        const nuevoComentario = new Comment({
            receta: recetaId,
            autor: req.usuario.id, // Viene del token
            texto
        });
        await nuevoComentario.save();
        res.status(201).json(nuevoComentario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al publicar comentario' });
    }
};

// Obtener comentarios de una receta
const obtenerComentarios = async (req, res) => {
    try {
        const comentarios = await Comment.find({ receta: req.params.recetaId })
            .populate('autor', 'nombre foto_perfil')
            .sort({ createdAt: -1 });
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cargar comentarios' });
    }
};

module.exports = { crearComentario, obtenerComentarios };
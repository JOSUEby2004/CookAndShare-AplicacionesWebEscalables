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

// Función exclusiva para ADMIN: Ver todos los comentarios de la plataforma
const obtenerTodosLosComentariosAdmin = async (req, res) => {
    try {
        const comentarios = await Comment.find()
            .populate('autor', 'nombre foto_perfil')
            .populate('receta', 'titulo') // Traemos el título de la receta
            .sort({ createdAt: -1 });
        res.status(200).json(comentarios);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ mensaje: 'Error al cargar los comentarios' });
    }
};

// Función exclusiva para ADMIN: Eliminar cualquier comentario
const eliminarComentarioAdmin = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Comentario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el comentario' });
    }
};

module.exports = { 
    crearComentario,
    obtenerComentarios,
    obtenerTodosLosComentariosAdmin,
    eliminarComentarioAdmin
};
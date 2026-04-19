const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const { crearComentario, obtenerComentarios } = require('../controllers/commentController');

// Ruta PUBLICA: Obtener comentarios de una receta
router.get('/:recetaId', obtenerComentarios);

// Ruta PROTEGIDA: Publicar un comentario (Protegido - Requiere Login)
router.post('/', verificarToken, crearComentario);

module.exports = router;
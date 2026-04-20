const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');
const { crearComentario, obtenerComentarios, obtenerTodosLosComentariosAdmin, eliminarComentarioAdmin } = require('../controllers/commentController');

// Ruta de ADMINISTRADOR: Obtener TODOS los comentarios de la plataforma
router.get('/admin/todos', verificarToken, verificarAdmin, obtenerTodosLosComentariosAdmin);

// Ruta de ADMINISTRADOR: Eliminar un comentario de la plataforma
router.delete('/admin/:id', verificarToken, verificarAdmin, eliminarComentarioAdmin)

// Ruta PUBLICA: Obtener comentarios de una receta
router.get('/:recetaId', obtenerComentarios);

// Ruta PROTEGIDA: Publicar un comentario (Protegido - Requiere Login)
router.post('/', verificarToken, crearComentario);

module.exports = router;
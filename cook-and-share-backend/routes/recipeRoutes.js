const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');
const { crearReceta, obtenerRecetas, obtenerTodasLasRecetasAdmin,
    obtenerMisRecetas, obtenerRecetaPorId, cambiarEstadoReceta,
    actualizarReceta, eliminarReceta } = require('../controllers/recipeController');

// Ruta PÚBLICA: GET /api/recetas (El Catálogo)
router.get('/', obtenerRecetas);

// Ruta PROTEGIDA: POST /api/recetas (Publicar)
router.post('/', verificarToken, crearReceta);

// Ruta PROTEGIDA: GET /api/recetas/mis-recetas (Perfil)
router.get('/mis-recetas', verificarToken, obtenerMisRecetas);

// Ruta de ADMINISTRADOR: GET /api/recetas/admin/todas
router.get('/admin/todas', verificarToken, verificarAdmin, obtenerTodasLasRecetasAdmin);

// Ruta PÚBLICA: GET /api/recetas/:id (Detalle)
router.get('/:id', obtenerRecetaPorId);

// Ruta PROTEGIDA: PUT /api/recetas/:id
router.put('/:id', verificarToken, actualizarReceta);

// Ruta PROTEGIDA: DELETE /api/recetas/:id
router.delete('/:id', verificarToken, eliminarReceta);

// Ruta de ADMINISTRADOR: PATCH /api/recetas/:id/estado
router.patch('/:id/estado', verificarToken, verificarAdmin, cambiarEstadoReceta);

module.exports = router;
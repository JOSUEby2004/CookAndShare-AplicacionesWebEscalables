const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');
const { registrarUsuario, loginUsuario, actualizarPerfil, obtenerTodosLosUsuarios, obtenerMiPerfil, eliminarUsuario } = require('../controllers/authController');

// Ruta PÚBLICA: POST /api/auth/registro
router.post('/registro', registrarUsuario);

// Ruta PÚBLICA: POST /api/auth/login
router.post('/login', loginUsuario);

// Ruta PROTEGIDA: PUT /api/auth/perfil
router.put('/perfil', verificarToken, actualizarPerfil);

// Ruta PROTEGIDA: GET /api/auth/perfil
router.get('/perfil', verificarToken, obtenerMiPerfil);

// Ruta de ADMINISTRADOR: GET /api/auth/usuarios
router.get('/usuarios', verificarToken, verificarAdmin, obtenerTodosLosUsuarios);

// Ruta de ADMINISTRADOR: DELETE /api/auth/usuarios/:id
router.delete('/usuarios/:id', verificarToken, verificarAdmin, eliminarUsuario);

module.exports = router;
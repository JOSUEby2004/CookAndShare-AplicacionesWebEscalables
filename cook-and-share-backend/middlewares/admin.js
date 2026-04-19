const verificarAdmin = (req, res, next) => {
    // Para este punto, verificarToken ya debió haber puesto los datos en req.usuario
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({
            mensaje: 'Acceso denegado. Esta zona es exclusiva para Administradores.'
        });
    }

    // Si sí es admin, lo dejamos pasar
    next();
};

module.exports = verificarAdmin;
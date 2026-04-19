const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Buscamos el token en las cabeceras (Headers) de la petición
    const authHeader = req.header('Authorization');

    // 2. Si no tiene un token, lo denegamos
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
    }

    try {
        // Normalmente el token viene con la palabra "Bearer " antes (ej. "Bearer eyJhbG...")
        // Usamos split para separar la palabra "Bearer" y quedarnos solo con el código
        const token = authHeader.split(' ')[1];

        // 3. Verificamos que el token sea auténtico y no haya expirado
        const payloadDecodificado = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Si es válido, le pegamos los datos del usuario a la petición (req)
        // Así, el siguiente controlador sabrá exactamente QUIÉN está haciendo la petición
        req.usuario = payloadDecodificado.usuario;

        // 5. Cedemos el control al siguiente paso
        next();
    } catch (error) {
        // Si el token fue modificado por un hacker o ya caducó (pasaron las 2 horas)
        res.status(401).json({ mensaje: 'Token no válido o expirado.' });
    }
};

module.exports = verificarToken;
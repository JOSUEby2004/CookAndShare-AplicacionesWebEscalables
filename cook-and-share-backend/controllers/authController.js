const User = require('../models/User');
const bcrypt = require('bcryptjs'); // El equivalente a password_hash de PHP
const jwt = require('jsonwebtoken'); //Para los Web Tokens


// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    try {
        // 1. Recibimos los datos del frontend (Angular enviará esto como JSON)
        const { nombre, email, password } = req.body;

        // 2. Verificamos si el usuario ya existe en la base de datos
        let usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        // 3. Encriptamos la contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(password, salt);

        // 4. Creamos el nuevo usuario con la contraseña segura
        const nuevoUsuario = new User({
            nombre,
            email,
            password: passwordHasheada,
            rol: 'usuario' // Por defecto, todos se crean como 'usuario'
        });

        // 5. Lo guardamos en MongoDB
        await nuevoUsuario.save();

        // 6. Respondemos con éxito (sin enviar la contraseña de vuelta, por seguridad)
        res.status(201).json({
            mensaje: '¡Usuario registrado con éxito!',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};

// Función para iniciar sesión
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificamos si el usuario existe por su correo
        const usuario = await User.findOne({ email });
        if (!usuario) {
            // Es buena práctica de seguridad no especificar si falló el correo o la contraseña
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // 2. Comparamos la contraseña en texto plano con el hash de la BD
        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // 3. Si todo es correcto, creamos el "payload" (los datos públicos del token)
        const payload = {
            usuario: {
                id: usuario._id,
                rol: usuario.rol // Guardamos el rol para saber si es admin o usuario regular
            }
        };

        // 4. Firmamos el token con nuestro secreto del archivo .env
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, // La llave secreta que creamos
            { expiresIn: '2h' }     // El token expirará en 2 horas por seguridad
        );

        // 5. Enviamos el token y los datos básicos al frontend
        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            usuario: {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                foto_perfil: usuario.foto_perfil
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};

// Función para actualizar Nombre y Foto de perfil
const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, foto } = req.body;

        // Buscamos al usuario por el ID del token y actualizamos
        // Excluimos la contraseña (.select('-password')) para que no viaje en la respuesta
        const usuarioActualizado = await User.findByIdAndUpdate(
            req.usuario.id,
            { nombre, foto_perfil: foto },
            { returnDocument: 'after' }
        ).select('-password');

        res.status(200).json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
    }
};

// Función exclusiva para Administradores: Ver todos los usuarios
const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        // Buscamos a todos, pero ocultamos la contraseña por seguridad (.select)
        const usuarios = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al cargar la lista de usuarios' });
    }
};

// Obtener el perfil del usuario logueado (Datos frescos)
const obtenerMiPerfil = async (req, res) => {
    try {
        // Buscamos al usuario por su ID y le quitamos el password por seguridad
        const usuario = await User.findById(req.usuario.id).select('-password');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener tu perfil' });
    }
};

// Función exclusiva para ADMIN: Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Regla de seguridad: Evitar que el admin se borre a sí mismo por accidente
        if (id === req.usuario.id) {
            return res.status(400).json({ mensaje: 'No puedes eliminar tu propia cuenta de administrador' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Usuario eliminado permanentemente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    actualizarPerfil,
    obtenerTodosLosUsuarios,
    obtenerMiPerfil,
    eliminarUsuario
};
const Recipe = require('../models/Recipe');

// Función para crear una nueva receta
const crearReceta = async (req, res) => {
    try {
        // 1. Extraemos los datos que el usuario llenó en el formulario (Angular enviará esto)
        const { titulo, descripcion, categoria, imagen, ingredientes, pasos } = req.body;

        // 2. Creamos la receta vinculando al autor automáticamente
        const nuevaReceta = new Recipe({
            autor: req.usuario.id, // Sabemos quién es gracias al token
            titulo,
            descripcion,
            categoria,
            imagen,
            ingredientes,
            pasos
            // El 'estado' por defecto es 'pendiente'
        });

        // 3. Guardamos en la base de datos
        const recetaGuardada = await nuevaReceta.save();

        // 4. Respondemos con éxito
        res.status(201).json({
            mensaje: 'Receta creada exitosamente',
            receta: recetaGuardada
        });

    } catch (error) {
        console.error('Error al crear la receta:', error);

        // Si Mongoose detecta que falta un campo obligatorio, mandará un error de validación
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios o el formato es incorrecto', detalles: error.message });
        }

        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};

// Función para obtener todas las recetas (El Catálogo)
const obtenerRecetas = async (req, res) => {
    try {
        // Buscamos todas las recetas en la base de datos
        // Usamos .populate() para ir a la colección 'User' y traernos solo el 'nombre'
        const recetas = await Recipe.find({ estado: 'aprobada' })
            .populate('autor', 'nombre')
            .sort({ createdAt: -1 }); // Las ordenamos de la más nueva a la más vieja

        // Respondemos con el arreglo de recetas
        res.status(200).json(recetas);

    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        res.status(500).json({ mensaje: 'Hubo un error al cargar las recetas' });
    }
};

// Función exclusiva para ADMIN: Obtener TODAS las recetas sin filtros
const obtenerTodasLasRecetasAdmin = async (req, res) => {
    try {
        const recetas = await Recipe.find()
            .populate('autor', 'nombre')
            .sort({ createdAt: -1 });

        res.status(200).json(recetas);
    } catch (error) {
        console.error('Error al obtener recetas para admin:', error);
        res.status(500).json({ mensaje: 'Error al cargar el catálogo de administrador' });
    }
};

// Función para obtener SOLO las recetas del usuario logueado
const obtenerMisRecetas = async (req, res) => {
    try {
        // Buscamos recetas donde el 'autor' coincida con el ID del token
        const misRecetas = await Recipe.find({ autor: req.usuario.id }).sort({ createdAt: -1 });
        res.status(200).json(misRecetas);
    } catch (error) {
        console.error('Error al obtener mis recetas:', error);
        res.status(500).json({ mensaje: 'Hubo un error al cargar tus recetas' });
    }
};

// Función para obtener UNA receta (Vista de Detalle)
const obtenerRecetaPorId = async (req, res) => {
    try {
        const receta = await Recipe.findById(req.params.id).populate('autor', 'nombre');
        if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
        res.status(200).json(receta);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar la receta' });
    }
};

// Función exclusiva para ADMIN: Aprobar o Rechazar
const cambiarEstadoReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Recibirá 'aprobada' o 'rechazada'

        const receta = await Recipe.findByIdAndUpdate(
            id,
            { estado },
            { returnDocument: 'after' }
        );

        res.status(200).json({ mensaje: `Receta marcada como ${estado}`, receta });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cambiar el estado de la receta' });
    }
};

// Función para actualizar una receta
const actualizarReceta = async (req, res) => {
    try {
        const { id } = req.params; // Sacamos el ID de la URL

        // 1. Buscamos la receta en la base de datos
        let receta = await Recipe.findById(id);
        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        // 2. Verificamos que el usuario sea el dueño de la receta o sea un admin
        if (receta.autor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permiso para editar esta receta' });
        }

        // 3. Actualizamos la receta. El { returnDocument: 'after' } es para que nos devuelva el documento ya actualizado.
        receta = await Recipe.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });

        res.status(200).json({
            mensaje: 'Receta actualizada exitosamente',
            receta
        });

    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};

// Función para eliminar una receta
const eliminarReceta = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscamos la receta
        let receta = await Recipe.findById(id);
        if (!receta) {
            return res.status(404).json({ mensaje: 'Receta no encontrada' });
        }

        // 2. Verificamos permisos (igual que en actualizar)
        if (receta.autor.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta receta' });
        }

        // 3. Eliminamos el documento
        await Recipe.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Receta eliminada correctamente' });

    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};

module.exports = {
    crearReceta,
    obtenerRecetas,
    obtenerTodasLasRecetasAdmin,
    obtenerMisRecetas,
    obtenerRecetaPorId,
    cambiarEstadoReceta,
    actualizarReceta,
    eliminarReceta
};
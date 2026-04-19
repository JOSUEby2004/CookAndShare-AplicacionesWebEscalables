const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env
const connectDB = require('./config/db'); // Importamos nuestra conexión

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos MongoDB
connectDB();

// Middlewares Globales
// Usamos CORS para que nuestro frontend pueda pedirle datos al backend sin ser bloqueado.
app.use(cors()); 
// Leer datos JSON enviados desde Angular.
app.use(express.json()); 

// Conectamos las rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Conectamos las rutas de recetas
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recetas', recipeRoutes);

// Conectamos las rutas de comentarios
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comentarios', commentRoutes);

// Configurar el puerto y encender el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
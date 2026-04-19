const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Intentamos conectar usando la variable del archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Base de datos MongoDB conectada con éxito');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        // Si la base de datos falla, detenemos el servidor
        process.exit(1); 
    }
};

module.exports = connectDB;
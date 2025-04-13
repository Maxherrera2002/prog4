// Cargar variables de ambiente
require('dotenv').config();

// 2 - Importación de módulos e inicia
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Inicializar Express
const app = express();

// Middleware para interpretar JSON
app.use(express.json()); // Viene integrado con Express
app.use(bodyParser.json()); // También se puede usar para mayor compatibilidad

// 3 - Conectarse a MongoDB

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME})
.then(() => console.log('Conexión a MongoDB exitosa'))
.catch(error => console.error('Error al conectar a MongoDB:', error));

// 4 - Definir el esquema y modelo de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad:   { type: Number, required: true },
  email:  { type: String, required: true, unique: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// 5 - Ruta GET /usuarios: Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6 - Ruta POST /usuarios: Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const usuarioNuevo = new Usuario(req.body);
    const usuarioGuardado = await usuarioNuevo.save();
    res.json(usuarioGuardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7 - Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

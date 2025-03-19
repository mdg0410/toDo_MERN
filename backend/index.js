const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarDB = require('./config/db');

// Configuración de variables de entorno
dotenv.config();

// Crear el servidor de express
const app = express();

// Conectar a la base de datos
conectarDB();

// Habilitar CORS
app.use(cors());

// Habilitar express.json
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Puerto de la app
const PORT = process.env.PORT || 4000;

// Ruta principal para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('API de ToDo MERN funcionando correctamente');
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`El servidor está funcionando en el puerto ${PORT}`);
});

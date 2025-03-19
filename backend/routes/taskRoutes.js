const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/TaskController');
const verifyJWT = require('../middlewares/verifyJWT');

// Aplicar middleware de verificación JWT a todas las rutas
router.use(verifyJWT);

// Ruta para crear y obtener todas las tareas
router.route('/')
  .post(createTask)
  .get(getTasks);

// Rutas para operaciones sobre una tarea específica
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;

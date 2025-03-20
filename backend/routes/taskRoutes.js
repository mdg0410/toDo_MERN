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

// Rutas para tareas
router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;

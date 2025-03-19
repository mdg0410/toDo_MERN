const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  getProjectTasks  // Importamos el nuevo método
} = require('../controllers/ProjectController');
const verifyJWT = require('../middlewares/verifyJWT');

// Aplicar middleware de verificación JWT a todas las rutas
router.use(verifyJWT);

// Rutas para proyectos
router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Ruta para obtener tareas de un proyecto específico
router.get('/:id/tasks', getProjectTasks);

module.exports = router;

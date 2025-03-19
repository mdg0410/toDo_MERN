const Project = require('../models/Project');
const Task = require('../models/Task');

// Crear un nuevo proyecto
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'El nombre del proyecto es obligatorio' });
    }

    const newProject = new Project({
      name,
      description,
      createdBy: req.user.id // Este dato viene del middleware verifyJWT
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};

// Obtener todos los proyectos del usuario autenticado
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente
    
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los proyectos', error: error.message });
  }
};

// Obtener un proyecto específico
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar si el usuario es el creador del proyecto
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
};

// Obtener tareas de un proyecto específico
const getProjectTasks = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el proyecto existe
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar si el usuario es el creador del proyecto
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Buscar todas las tareas asociadas al proyecto
    const tasks = await Task.find({ project: id })
      .populate('assignedTo', 'name email');
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las tareas del proyecto', error: error.message });
  }
};

// Actualizar un proyecto
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Verificar que el proyecto existe
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar si el usuario es el creador del proyecto
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Actualizar proyecto
    project = await Project.findByIdAndUpdate(
      req.params.id, 
      { name, description },
      { new: true }
    );

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};

// Eliminar un proyecto
const deleteProject = async (req, res) => {
  try {
    // Verificar que el proyecto existe
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Verificar si el usuario es el creador del proyecto
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Eliminar proyecto
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectTasks  // Añadimos el nuevo método
};

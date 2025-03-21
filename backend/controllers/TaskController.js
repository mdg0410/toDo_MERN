const Task = require('../models/Task');
const mongoose = require('mongoose');

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description, status, project } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'El título de la tarea es obligatorio' });
    }

    const newTask = new Task({
      title,
      description,
      status: status || 'pending',
      project: project || null,
      createdBy: req.user.id // Este dato viene del middleware verifyJWT
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

// Obtener todas las tareas del usuario
const getTasks = async (req, res) => {
  try {
    // Construir filtro base
    const filter = { createdBy: req.user.id };
    
    // Filtrar por proyecto si se proporciona el ID
    if (req.query.project) {
      filter.project = req.query.project;
    } else if (req.query.noProject === 'true') {
      filter.project = { $eq: null };
    }
    
    // Filtrar por estado si se proporciona
    if (req.query.status && ['pending', 'in-progress', 'completed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    
    // Opciones de paginación y ordenamiento
    const options = {
      sort: { createdAt: -1 },
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip) : undefined
    };
    
    const tasks = await Task.find(filter, null, options)
      .populate('project', 'name');
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
};

// Obtener una tarea específica
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar si el usuario es el creador de la tarea
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
  try {
    const { title, description, status, project } = req.body;
    
    // Verificar que la tarea existe
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar si el usuario es el creador de la tarea
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Datos a actualizar
    const updatedData = { 
      title, 
      description, 
      status,
      project,
      updatedAt: Date.now()
    };

    // Actualizar tarea
    task = await Task.findByIdAndUpdate(
      req.params.id, 
      { $set: updatedData },
      { new: true }
    ).populate('project', 'name');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    // Verificar que la tarea existe
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar si el usuario es el creador de la tarea
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Eliminar tarea
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};

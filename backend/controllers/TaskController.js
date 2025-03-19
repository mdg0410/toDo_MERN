const Task = require('../models/Task');
const mongoose = require('mongoose');

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description, status, project, assignedTo } = req.body;
    
    // Validación básica
    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }
    
    const newTask = new Task({ 
      title, 
      description, 
      status, 
      project, 
      assignedTo 
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
  }
};

// Obtener todas las tareas
const getTasks = async (req, res) => {
  try {
    // Opcionalmente se pueden filtrar por proyecto o usuario asignado
    const { project, assignedTo, status } = req.query;
    let filter = {};
    
    // Filtrar por proyecto si se proporciona un ID válido
    if (project) {
      // Validar que el ID del proyecto sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({ message: 'ID de proyecto no válido' });
      }
      filter.project = project;
    }
    
    // Filtrar por usuario asignado
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
      }
      filter.assignedTo = assignedTo;
    }
    
    // Filtrar por estado
    if (status && ['pendiente', 'en progreso', 'completada'].includes(status)) {
      filter.status = status;
    }
    
    // Consultar las tareas con los filtros aplicados
    const tasks = await Task.find(filter);
    
    // Poblar las referencias de proyecto y usuario asignado
    try {
      await Task.populate(tasks, [
        { path: 'project', select: 'name description' },
        { path: 'assignedTo', select: 'name email' }
      ]);
    } catch (populateError) {
      console.warn('No se pudieron poblar las referencias:', populateError.message);
      // Continuar sin población
    }
      
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas', error: error.message });
  }
};

// Obtener una tarea específica
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
      
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Intentar poblar las referencias de manera segura
    try {
      await Task.populate(task, [
        { path: 'project', select: 'name' },
        { path: 'assignedTo', select: 'name email' }
      ]);
    } catch (populateError) {
      console.warn('No se pudieron poblar las referencias:', populateError.message);
      // Continuar sin población
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, project, assignedTo } = req.body;
    
    // Verificar si la tarea existe
    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    // Actualizar los campos
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, project, assignedTo },
      { new: true }
    );
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la tarea existe
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    await Task.findByIdAndRemove(id);
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
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

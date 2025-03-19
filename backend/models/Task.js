const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada'],
    default: 'pendiente'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false  // Cambiado a false para permitir tareas sin proyecto por ahora
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Task', TaskSchema);

import React from 'react';
import { Task } from '../redux/taskSlice';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  // Función para obtener el color de badge según el estado
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Formatea la fecha para mostrarla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span 
          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(task.status)}`}
        >
          {task.status === 'pending' && 'Pendiente'}
          {task.status === 'in-progress' && 'En Progreso'}
          {task.status === 'completed' && 'Completada'}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
      )}
      
      <div className="text-xs text-gray-500 mb-3">
        Creada: {formatDate(task.createdAt)}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-md transition"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

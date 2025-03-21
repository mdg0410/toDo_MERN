import React from 'react';
import { Task } from '../redux/taskSlice';
import { Link } from 'react-router-dom';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'pending':
        return 'border-yellow-500 bg-yellow-50';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300';
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'pending':
        return 'Pendiente';
      case 'in-progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <div className={`rounded-lg shadow-md p-4 border-l-4 ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1">
              {task.description}
            </p>
          )}
          
          {/* Información del proyecto */}
          {task.project ? (
            <Link 
              to={`/projects/${task.project._id}`}
              className="mt-2 inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
            >
              Proyecto: {task.project.name}
            </Link>
          ) : (
            <span className="mt-2 inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Sin proyecto
            </span>
          )}
          
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {statusText}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Editar tarea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Eliminar tarea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Creado: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskItem;

import React from 'react';
import { Project } from '../redux/projectSlice';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
          <p className="text-gray-600 mt-1 text-sm">
            {project.description || 'Sin descripción'}
          </p>
          <div className="mt-3 flex space-x-2">
            <Link 
              to={`/projects/${project._id}`}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Ver tareas
            </Link>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Editar proyecto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Eliminar proyecto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Creado: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProjectItem;

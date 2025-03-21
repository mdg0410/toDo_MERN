import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { 
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  clearCurrentProject,
  Project
} from '../redux/projectSlice';
import ProjectItem from '../components/ProjectItem';

const ProjectsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error, currentProject } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Referencia al formulario para hacer scroll automático
  const formRef = useRef<HTMLDivElement>(null);

  // Cargar proyectos al iniciar
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Rellenar formulario cuando se selecciona un proyecto para editar
  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name);
      setDescription(currentProject.description || '');
      setIsEditing(true);
      
      // Hacer scroll al formulario
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [currentProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const projectData = {
      name,
      description: description.trim() ? description : undefined,
    };
    
    if (isEditing && currentProject) {
      dispatch(updateProject({ id: currentProject._id, ...projectData }));
    } else {
      dispatch(createProject(projectData));
    }
    
    // Limpiar el formulario
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsEditing(false);
    dispatch(clearCurrentProject());
  };

  const handleEdit = (project: Project) => {
    dispatch(setCurrentProject(project));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto? Esto no eliminará las tareas asociadas.')) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Cabecera personalizada */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {user ? `Proyectos de ${user.name}` : 'Mis Proyectos'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user ? `Gestiona tus proyectos personales, ${user.name}` : 'Gestiona tus proyectos personales'}
        </p>
      </div>

      {/* Formulario */}
      <div 
        ref={formRef} 
        className="bg-white p-4 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Proyecto'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Estado de carga */}
      {loading && !isEditing && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando proyectos...</p>
        </div>
      )}
      
      {/* Lista de proyectos */}
      {!loading && projects.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            {user ? `No tienes proyectos creados, ${user.name}.` : 'No tienes proyectos creados.'}
          </p>
          <p className="text-gray-500 text-sm mt-2">¡Crea un nuevo proyecto para organizarte mejor!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectItem
              key={project._id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

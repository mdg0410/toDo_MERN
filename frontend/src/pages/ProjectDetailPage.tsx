import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { 
  fetchProjects,
  setCurrentProject
} from '../redux/projectSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setCurrentTask,
  clearCurrentTask,
  Task
} from '../redux/taskSlice';
import TaskItem from '../components/TaskItem';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { projects, loading: projectLoading } = useSelector((state: RootState) => state.projects);
  const { tasks, loading: taskLoading, error, currentTask } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const project = projects.find(p => p._id === projectId);
  const projectTasks = tasks.filter(task => task.project?._id === projectId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Referencia al formulario para hacer scroll automático
  const formRef = useRef<HTMLDivElement>(null);

  // Cargar proyectos y tareas al iniciar
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjects());
      dispatch(fetchTasks({ projectId }));
    }
  }, [dispatch, projectId]);

  // Rellenar formulario cuando se selecciona una tarea para editar
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setStatus(currentTask.status);
      setIsEditing(true);
      
      // Hacer scroll al formulario
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [currentTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const taskData = {
      title,
      description: description.trim() ? description : undefined,
      status,
      project: projectId
    };
    
    if (isEditing && currentTask) {
      dispatch(updateTask({ id: currentTask._id, ...taskData }));
    } else {
      dispatch(createTask(taskData));
    }
    
    // Limpiar el formulario
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setIsEditing(false);
    dispatch(clearCurrentTask());
  };

  const handleEdit = (task: Task) => {
    dispatch(setCurrentTask(task));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      dispatch(deleteTask(id));
    }
  };

  const loading = projectLoading || taskLoading;

  // Filtrar las tareas según el estado seleccionado
  const filteredProjectTasks = statusFilter 
    ? projectTasks.filter(task => task.status === statusFilter) 
    : projectTasks;

  // Estadísticas de tareas
  const stats = {
    total: projectTasks.length,
    pending: projectTasks.filter(t => t.status === 'pending').length,
    inProgress: projectTasks.filter(t => t.status === 'in-progress').length,
    completed: projectTasks.filter(t => t.status === 'completed').length,
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  if (!project && !projectLoading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md mb-6">
          <p>No se encontró el proyecto o no tienes acceso.</p>
          <Link to="/projects" className="font-medium hover:underline text-blue-600 mt-2 inline-block">
            Volver a mis proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Navegación y título */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link to="/projects" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Proyectos
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold">
          {project ? project.name : 'Cargando...'}
        </h1>
        <p className="text-gray-600 mt-1">
          {project ? project.description : ''}
        </p>
      </div>

      {/* Formulario */}
      <div 
        ref={formRef} 
        className="bg-white p-4 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea en este Proyecto'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
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
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Tarea'}
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
          <p className="mt-2 text-gray-600">Cargando tareas...</p>
        </div>
      )}
      
      {/* Estadísticas del proyecto */}
      {!loading && project && (
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Estadísticas del proyecto</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-bold text-gray-800">{stats.total}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md text-center">
                <div className="text-sm text-yellow-700">Pendientes</div>
                <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-center">
                <div className="text-sm text-blue-700">En progreso</div>
                <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-md text-center">
                <div className="text-sm text-green-700">Completadas</div>
                <div className="text-xl font-bold text-green-600">{stats.completed}</div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">Progreso del proyecto</span>
                <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    completionPercentage < 30 ? 'bg-red-500' :
                    completionPercentage < 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filtro de estado para tareas del proyecto */}
      {!loading && project && projectTasks.length > 0 && (
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label htmlFor="statusFilter" className="block text-gray-700 font-medium mb-2">
              Filtrar por estado
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Lista de tareas */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Tareas de este proyecto
          {statusFilter && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Filtradas por: {statusFilter === 'pending' ? 'Pendiente' : statusFilter === 'in-progress' ? 'En Progreso' : 'Completada'})
            </span>
          )}
        </h2>
        
        {!loading && filteredProjectTasks.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">
              {statusFilter ? 'No hay tareas con el estado seleccionado.' : 'No hay tareas en este proyecto.'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {!statusFilter && '¡Crea una nueva tarea para comenzar!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tasks-grid">
            {filteredProjectTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;

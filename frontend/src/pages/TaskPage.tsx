import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  setCurrentTask, 
  clearCurrentTask,
  Task
} from '../redux/taskSlice';
import { fetchProjects } from '../redux/projectSlice';
import TaskItem from '../components/TaskItem';
import { Link } from 'react-router-dom';

const TaskPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, currentTask } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [projectId, setProjectId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [filterProject, setFilterProject] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');  
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Referencia al formulario para hacer scroll automático
  const formRef = useRef<HTMLDivElement>(null);

  // Cargar tareas y proyectos al iniciar
  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks(undefined));
  }, [dispatch]);

  // Rellenar formulario cuando se selecciona una tarea para editar
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setStatus(currentTask.status);
      setProjectId(currentTask.project?._id || '');
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
      project: projectId || null
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
    setProjectId('');
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

  // Función para buscar
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    // Filtrar por texto de búsqueda
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro por proyecto
    if (filterProject === 'none') {
      if (task.project) return false;
    } else if (filterProject && task.project?._id !== filterProject) {
      return false;
    }
    
    // Filtro por estado
    if (filterStatus && task.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Cabecera personalizada con el nombre del usuario */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">
            {user ? `Tareas de ${user.name}` : 'Mis Tareas'}
          </h1>
          <Link to="/projects" className="text-blue-600 hover:underline flex items-center">
            Gestionar Proyectos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <p className="text-gray-600 mt-1">
          {user ? `Gestiona tus tareas personales, ${user.name}` : 'Gestiona tus tareas personales'}
        </p>
      </div>

      {/* Formulario */}
      <div 
        ref={formRef} 
        className="bg-white p-4 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
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
            
            <div>
              <label htmlFor="project" className="block text-gray-700 font-medium mb-2">
                Proyecto <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin proyecto</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
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

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Filtros combinados */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filterProject" className="block text-gray-700 font-medium mb-2">
              Por proyecto
            </label>
            <select
              id="filterProject"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las tareas</option>
              <option value="none">Tareas sin proyecto</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filterStatus" className="block text-gray-700 font-medium mb-2">
              Por estado
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>
        </div>
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
      
      {/* Lista de tareas */}
      {!loading && filteredTasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            {filterProject || filterStatus ? 'No hay tareas que coincidan con los filtros aplicados.' : 'No tienes tareas pendientes.'}
          </p>
          <p className="text-gray-500 text-sm mt-2">¡Crea una nueva tarea para comenzar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
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
  );
};

export default TaskPage;

import React, { useState, useEffect } from 'react';
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
import TaskItem from '../components/TaskItem';

const TaskPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, currentTask } = useSelector((state: RootState) => state.tasks);
  // El usuario se obtiene para personalizar la experiencia y mostrar mensajes personalizados
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar tareas al iniciar
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Rellenar formulario cuando se selecciona una tarea para editar
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || '');
      setStatus(currentTask.status);
      setIsEditing(true);
    }
  }, [currentTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const taskData = {
      title,
      description: description.trim() ? description : undefined,
      status
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

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Cabecera personalizada con el nombre del usuario */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {user ? `Tareas de ${user.name}` : 'Mis Tareas'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user ? `Gestiona tus tareas personales, ${user.name}` : 'Gestiona tus tareas personales'}
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
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
      
      {/* Lista de tareas */}
      {!loading && tasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            {user ? `No tienes tareas pendientes, ${user.name}.` : 'No tienes tareas pendientes.'}
          </p>
          <p className="text-gray-500 text-sm mt-2">¡Crea una nueva tarea para comenzar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
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

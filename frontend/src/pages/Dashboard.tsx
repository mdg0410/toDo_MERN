import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks } from '../redux/taskSlice';
import { fetchProjects } from '../redux/projectSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchTasks(undefined));
    dispatch(fetchProjects());
  }, [dispatch]);

  // Contar tareas pendientes, en progreso y completadas
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  // Contar tareas sin proyecto
  const tasksWithoutProject = tasks.filter(task => !task.project).length;

  // Calcular porcentaje de tareas completadas
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const loading = tasksLoading || projectsLoading;

  // Si user no existe, mostrar un mensaje genérico
  const userName = user?.name || 'Usuario';

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Cabecera personalizada */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver un resumen de tu actividad
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Proyectos</h3>
              <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
              <Link to="/projects" className="text-blue-500 text-sm hover:underline mt-3 block">
                Ver todos los proyectos →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Tareas Pendientes</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
              <Link to="/tasks" className="text-blue-500 text-sm hover:underline mt-3 block">
                Ver todas las tareas →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Tareas Completadas</h3>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
              <div className="mt-2 text-sm text-gray-500">
                {completionPercentage}% del total
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">En Progreso</h3>
              <p className="text-3xl font-bold text-purple-600">{inProgressTasks}</p>
              <div className="mt-2 text-sm text-gray-500">
                Tareas sin proyecto: {tasksWithoutProject}
              </div>
            </div>
          </div>

          {/* Proyectos recientes */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Proyectos Recientes</h2>
              <Link to="/projects" className="text-blue-600 hover:underline">
                Ver todos
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No tienes proyectos creados aún.</p>
                <Link to="/projects" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Crear tu primer proyecto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map(project => (
                  <div key={project._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm truncate">
                      {project.description || 'Sin descripción'}
                    </p>
                    <div className="mt-3">
                      <Link 
                        to={`/projects/${project._id}`}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        Ver tareas
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Tareas recientes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tareas Recientes</h2>
              <Link to="/tasks" className="text-blue-600 hover:underline">
                Ver todas
              </Link>
            </div>
            
            {tasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No tienes tareas creadas aún.</p>
                <Link to="/tasks" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Crear tu primera tarea
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.slice(0, 6).map(task => {
                  const statusColors = {
                    'pending': 'border-yellow-500 bg-yellow-50',
                    'in-progress': 'border-blue-500 bg-blue-50',
                    'completed': 'border-green-500 bg-green-50'
                  };
                  
                  const statusText = {
                    'pending': 'Pendiente',
                    'in-progress': 'En Progreso',
                    'completed': 'Completada'
                  };
                  
                  return (
                    <div 
                      key={task._id} 
                      className={`rounded-lg shadow-md p-4 border-l-4 ${statusColors[task.status]}`}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      {task.project ? (
                        <Link 
                          to={`/projects/${task.project._id}`}
                          className="mt-2 inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                        >
                          {task.project.name}
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
                          {statusText[task.status]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;

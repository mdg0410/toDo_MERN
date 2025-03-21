import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { verifyUser } from './redux/authSlice';

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TaskPage from './pages/TaskPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar el token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('token');
        
        // Si hay un token, intentar verificarlo
        if (token) {
          await dispatch(verifyUser()).unwrap();
        }
        
        // Marcar la inicialización como completada
        setIsInitialized(true);
      } catch (error) {
        // Fallback silencioso - la lógica de manejo ya está en el slice
        console.log('Verificación de usuario completada con fallback');
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  // Mostrar un indicador de carga durante la inicialización
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={user || token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user || token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="tasks" element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          } />
          
          <Route path="projects" element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          
          <Route path="projects/:projectId" element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

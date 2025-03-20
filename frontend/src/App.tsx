import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { verifyUser } from './redux/authSlice';
import { AppDispatch } from './redux/store';

// Importa aquí tus otras páginas como TaskPage, etc.
// import TaskPage from './pages/TaskPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    dispatch(verifyUser());
  }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          {/* Define aquí tus rutas protegidas */}
          <Route path="/tasks" element={<div>Página de tareas (por implementar)</div>} />
          {/* <Route path="/tasks" element={<TaskPage />} /> */}
        </Route>
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

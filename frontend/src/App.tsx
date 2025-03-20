import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskPage from './pages/TaskPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { verifyUser } from './redux/authSlice';
import { AppDispatch } from './redux/store';

// Componente que envuelve el layout para rutas protegidas
const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-4">
        <Outlet />
      </div>
    </>
  );
};

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
          <Route element={<ProtectedLayout />}>
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
          </Route>
        </Route>
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

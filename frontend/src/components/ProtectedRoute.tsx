import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { verifyUser } from '../redux/authSlice';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    // Verificar el token al cargar una ruta protegida
    if (!isAuthenticated) {
      dispatch(verifyUser());
    }
  }, [dispatch, isAuthenticated]);
  
  // Mientras verifica, mostrar un spinner o mensaje de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Si no está autenticado después de verificar, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si está autenticado, mostrar las rutas hijo
  return <Outlet />;
};

export default ProtectedRoute;

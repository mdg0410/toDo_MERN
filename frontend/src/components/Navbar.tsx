import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { AppDispatch, RootState } from '../redux/store';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/tasks" className="text-xl font-bold">
          ToDo App MERN
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="mr-2 hidden sm:inline">Bienvenido,</span>
              <span className="font-semibold">{user.name}</span>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

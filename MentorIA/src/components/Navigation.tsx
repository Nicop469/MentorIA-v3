import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { getUserProfile } from '../services/storageService';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = getUserProfile();
  
  const navItems = [
    { name: 'Inicio', path: '/', icon: <Home size={20} /> },
    { name: 'Pr\u00e1ctica', path: '/practice', icon: <BookOpen size={20} /> },
    { name: 'Perfil', path: '/profile', icon: <User size={20} /> },
  ];
  
  if (profile.isTeacher) {
    navItems.push({ name: 'Panel de Profesor', path: '/teacher', icon: <Settings size={20} /> });
  }
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl text-primary-600">EduProfile AI</span>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  location.pathname === item.path
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
          
          {profile.name && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4 hidden sm:block">
                Hola, {profile.name}
              </span>
              <button
                onClick={() => navigate('/logout')}
                className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700"
                aria-label="Cerrar sesi\u00f3n"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="grid grid-cols-4 text-xs">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                location.pathname === item.path
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
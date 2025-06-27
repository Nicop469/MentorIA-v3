import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, GraduationCap } from 'lucide-react';
import { useUser } from '../context/UserContext';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, userProfile } = useUser();
  const [name, setName] = useState<string>(userProfile.name || '');
  const [showNameInput, setShowNameInput] = useState<boolean>(!userProfile.name);
  
  const handleStart = () => {
    if (!userProfile.name && !name.trim()) {
      setShowNameInput(true);
      return;
    }
    
    if (name.trim()) {
      updateProfile({ name });
    }
    
    navigate('/courses');
  };
  
  const handleTeacherLogin = () => {
    if (!userProfile.name && !name.trim()) {
      setShowNameInput(true);
      return;
    }
    
    if (name.trim()) {
      updateProfile({ name: name.trim() });
    }
    
    // Check if user is already registered as teacher
    if (userProfile.isTeacher) {
      navigate('/teacher');
    } else {
      // Navigate to teacher registration
      navigate('/teacher-registration');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-primary-600">EduProfile AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Plataforma de aprendizaje personalizada que adapta el contenido de matem\u00e1ticas a tu nivel y rendimiento.
          </p>
          
          {showNameInput ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto mb-8"
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Tu nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                placeholder="Ingresa tu nombre"
                autoFocus
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleStart}
                  disabled={!name.trim()}
                  className={`flex-1 py-3 rounded-md text-white font-medium ${
                    name.trim() 
                      ? 'bg-primary-600 hover:bg-primary-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Comenzar a aprender
                </button>
                <button
                  onClick={handleTeacherLogin}
                  disabled={!name.trim()}
                  className={`flex-1 py-3 rounded-md font-medium border ${
                    name.trim() 
                      ? 'border-primary-600 text-primary-600 hover:bg-primary-50' 
                      : 'border-gray-400 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Soy profesor
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="bg-primary-600 text-white text-lg font-medium py-3 px-8 rounded-md hover:bg-primary-700 transition-colors"
              >
                Start Learning
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTeacherLogin}
                className="border border-primary-600 text-primary-600 text-lg font-medium py-3 px-8 rounded-md hover:bg-primary-50 transition-colors flex items-center"
              >
                <GraduationCap size={20} className="mr-2" />
                Portal docente
              </motion.button>
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Aprendizaje personalizado</h3>
            <p className="text-gray-600 text-center">
              Nuestro sistema se adapta a tu nivel de habilidad y te brinda el desaf\u00edo perfecto cada vez.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Sigue tu progreso</h3>
            <p className="text-gray-600 text-center">
              Observa tus mejoras con el tiempo mediante an\u00e1lisis detallados de rendimiento.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Recomendaciones inteligentes</h3>
            <p className="text-gray-600 text-center">
              Obt\u00e9n sugerencias de contenido seg\u00fan tu rendimiento y patrones de aprendizaje.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
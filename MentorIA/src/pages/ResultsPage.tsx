import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DiagnosticResult } from '../types';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import PerformanceChart from '../components/PerformanceChart';
import { ArrowRight, Award, Clock, CheckCircle } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { userProfile } = useUser();
  
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  
  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    // Find diagnostic result for this course
    const diagnosticResult = userProfile.diagnosticResults.find(r => r.courseId === courseId);
    
    if (!diagnosticResult) {
      navigate(`/diagnostic/${courseId}`);
      return;
    }
    
    setResult(diagnosticResult);
  }, [courseId, navigate, userProfile.diagnosticResults]);
  
  const getSkillLevelDescription = (level: number) => {
    if (level >= 9) return 'Advanced';
    if (level >= 7) return 'Proficient';
    if (level >= 5) return 'Intermediate';
    if (level >= 3) return 'Basic';
    return 'Beginner';
  };
  
  const handleContinueToPractice = () => {
    if (courseId) {
      navigate(`/practice/${courseId}`);
    }
  };
  
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados del diagn\u00f3stico</h1>
          <p className="text-gray-600">
            Aqu\u00ed tienes un resumen de tu desempe\u00f1o en la evaluaci\u00f3n diagn\u00f3stica.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Award size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Nivel de habilidad</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.skillLevel}/10
            </div>
            <p className="text-gray-600">
              {getSkillLevelDescription(result.skillLevel)}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <CheckCircle size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Precisi\u00f3n</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.correctPercentage}%
            </div>
            <p className="text-gray-600">
              {result.correctPercentage >= 80
                ? 'Comprensi\u00f3n excelente'
                : result.correctPercentage >= 60
                ? 'Buen dominio de los conceptos'
                : 'Espacio para mejorar'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Clock size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Tiempo promedio</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.averageTime}s
            </div>
            <p className="text-gray-600">
              {result.averageTime <= 30
                ? 'Respuesta muy r\u00e1pida'
                : result.averageTime <= 60
                ? 'Tiempo de respuesta promedio'
                : 'Un poco m\u00e1s lento de lo promedio'}
            </p>
          </motion.div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">An\u00e1lisis de rendimiento</h3>
          <PerformanceChart attempts={result.attempts} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recomendaci\u00f3n</h3>
          <p className="text-gray-700 mb-4">
            Seg\u00fan tu diagn\u00f3stico, te recomendamos comenzar con contenido de nivel {result.skillLevel} y avanzar gradualmente.
            Mostraste {result.correctPercentage >= 70 ? 'un dominio fuerte' : 'un dominio adecuado'} de los conceptos,
            con un tiempo de respuesta promedio de {result.averageTime} segundos.
          </p>
          
          <p className="text-gray-700 mb-6">
            Contin\u00faa al modo de pr\u00e1ctica para mejorar tus habilidades y seguir tu progreso con el tiempo.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinueToPractice}
            className="inline-flex items-center bg-primary-600 text-white font-medium py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
          >
            Continuar al modo de pr\u00e1ctica
            <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
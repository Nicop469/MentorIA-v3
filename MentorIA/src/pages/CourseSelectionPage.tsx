import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course, Chapter } from '../types';
import CourseCard from '../components/CourseCard';
import Navigation from '../components/Navigation';
import { getCourses } from '../services/storageService';
import { BookOpen, GraduationCap } from 'lucide-react';

interface CourseFramework {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  teacherId: string;
}

const CourseSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFrameworks, setCourseFrameworks] = useState<CourseFramework[]>([]);
  const [activeTab, setActiveTab] = useState<'standard' | 'structured'>('standard');
  
  useEffect(() => {
    setCourses(getCourses());
    
    // Load course frameworks
    const frameworks = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    setCourseFrameworks(frameworks);
  }, []);
  
  const handleSelectStandardCourse = (courseId: string) => {
    navigate(`/vark/${courseId}`);
  };
  
  const handleSelectFrameworkCourse = (courseId: string) => {
    navigate(`/chapters/${courseId}`);
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selecciona un curso</h1>
          <p className="text-gray-600 mb-8">
            Elige una materia para comenzar tu camino de aprendizaje personalizado
          </p>
        </motion.div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('standard')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'standard'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen size={18} className="mr-2" />
                Cursos generales
              </button>
              <button
                onClick={() => setActiveTab('structured')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'structured'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap size={18} className="mr-2" />
                Cursos estructurados
                {courseFrameworks.length > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                    {courseFrameworks.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'standard' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Cursos de matem\u00e1ticas generales
                </h2>
                <p className="text-gray-600 mb-6">
                  Estos cursos utilizan nuestro banco de preguntas general y el sistema de aprendizaje adaptativo.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={handleSelectStandardCourse}
                    />
                  ))}
                </div>
              </>
            )}
            
            {activeTab === 'structured' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Cursos dise\u00f1ados por docentes
                </h2>
                <p className="text-gray-600 mb-6">
                  Estos cursos siguen s\u00edlabos espec\u00edficos creados por profesores con cap\u00edtulos estructurados y conceptos.
                </p>
                
                {courseFrameworks.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      A\u00fan no hay cursos estructurados disponibles.
                    </p>
                    <p className="text-sm text-gray-400">
                      Los docentes pueden crear cursos estructurados desde el panel de profesor.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseFrameworks.map((framework) => (
                      <CourseCard
                        key={framework.id}
                        course={{
                          id: framework.id,
                          name: framework.name,
                          description: framework.description,
                          chapters: framework.chapters
                        }}
                        onSelect={handleSelectFrameworkCourse}
                        isFrameworkCourse={true}
                        teacherName={framework.teacherId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500 text-center">
            \u00bfNo ves tu materia? Los docentes pueden a\u00f1adir m\u00e1s cursos desde el panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseSelectionPage;
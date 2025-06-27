import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course } from '../types';
import { getCourses } from '../services/storageService';
import Navigation from '../components/Navigation';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const CourseOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  
  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    // Get course data
    const courses = getCourses();
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (!foundCourse) {
      navigate('/courses');
      return;
    }
    
    setCourse(foundCourse);
  }, [courseId, navigate]);
  
  const toggleClassExpansion = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to {course.name}
          </h1>
          <p className="text-gray-600">
            {course.description}
          </p>
        </motion.div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Overview</h2>
          
          {!course.classes || course.classes.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                No classes available for this course yet.
              </p>
              <p className="text-sm text-gray-400">
                Please check back later or contact your instructor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.classes
                .sort((a, b) => a.number - b.number)
                .map((courseClass) => (
                  <motion.div
                    key={courseClass.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleClassExpansion(courseClass.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Class {courseClass.number}: {courseClass.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {courseClass.description}
                          </p>
                        </div>
                        <div className="ml-4">
                          {expandedClass === courseClass.id ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {expandedClass === courseClass.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 bg-white border-t border-gray-200"
                      >
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700">
                            {courseClass.content || 'Content coming soon...'}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Back to Courses
          </button>
          
          <button
            onClick={() => navigate(`/practice/${courseId}`)}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseOnboardingPage;
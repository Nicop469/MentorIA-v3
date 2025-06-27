import React from 'react';
import { Course } from '../types';
import { motion } from 'framer-motion';
import { BookOpen, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
  isFrameworkCourse?: boolean;
  teacherName?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onSelect, 
  isFrameworkCourse = false,
  teacherName 
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <BookOpen size={20} />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
            {isFrameworkCourse && teacherName && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <User size={14} className="mr-1" />
                {teacherName}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        {isFrameworkCourse && course.chapters && (
          <div className="mb-4 text-sm text-gray-500">
            {course.chapters.length} chapters • {' '}
            {course.chapters.reduce((total, chapter) => total + chapter.concepts.length, 0)} concepts
          </div>
        )}
        
        <button
          onClick={() => onSelect(course.id)}
          className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <span>
            {isFrameworkCourse ? 'Seleccionar cap\u00edtulo' : 'Seleccionar curso'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
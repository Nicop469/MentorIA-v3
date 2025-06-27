import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import { getCourses } from '../services/storageService';
import { Edit, Clock, Award, BookOpen, Trash2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile, clearProfile } = useUser();
  
  const courses = getCourses();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Get course name from ID
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.name || courseId;
  };
  
  const handleEditName = () => {
    const newName = prompt('Enter your name:', userProfile.name);
    if (newName && newName.trim()) {
      updateProfile({ name: newName.trim() });
    }
  };
  
  const handleClearProfile = () => {
    if (confirm('Are you sure you want to clear all your progress? This cannot be undone.')) {
      clearProfile();
      navigate('/');
    }
  };
  
  const handleToggleTeacherMode = () => {
    const teacherCode = prompt('Enter teacher code (use "teacher123" for this demo):');
    if (teacherCode === 'teacher123') {
      updateProfile({ isTeacher: !userProfile.isTeacher });
    } else if (teacherCode) {
      alert('Invalid teacher code.');
    }
  };
  
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <button
              onClick={handleClearProfile}
              className="text-red-600 hover:text-red-800 flex items-center text-sm"
            >
              <Trash2 size={16} className="mr-1" />
              Reset Profile
            </button>
          </div>
        </motion.div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{userProfile.name}</h2>
              <p className="text-gray-600">
                {userProfile.isTeacher ? 'Teacher Account' : 'Student Account'}
              </p>
            </div>
            <button
              onClick={handleEditName}
              className="text-primary-600 hover:text-primary-800 flex items-center"
            >
              <Edit size={18} className="mr-1" />
              Edit
            </button>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={handleToggleTeacherMode}
              className="text-sm text-gray-500 hover:text-primary-600"
            >
              {userProfile.isTeacher ? 'Switch to Student Mode' : 'Teacher Login'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {userProfile.diagnosticResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-primary-600" />
                Skill Levels
              </h3>
              
              <div className="space-y-4">
                {userProfile.diagnosticResults.map((result, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{getCourseName(result.courseId)}</span>
                    <div className="flex items-center">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${(result.skillLevel / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {result.skillLevel}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {userProfile.practiceSessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-primary-600" />
                Recent Practice Sessions
              </h3>
              
              <div className="space-y-3">
                {userProfile.practiceSessions
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((session, index) => (
                    <div 
                      key={index}
                      className="p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/summary/${session.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{getCourseName(session.courseId)}</span>
                        <span className="text-xs text-gray-500">{formatDate(session.date)}</span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="text-sm text-gray-600">
                          <span className={`${
                            session.correctPercentage >= 70 
                              ? 'text-green-600' 
                              : session.correctPercentage >= 50 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {session.correctPercentage}% accuracy
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Level: {session.startingLevel} → {session.endingLevel}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {userProfile.practiceSessions.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {}}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    View all sessions
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen size={20} className="mr-2 text-primary-600" />
            Continue Learning
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="p-4 border border-gray-200 rounded-md hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => navigate(`/practice/${course.id}`)}
              >
                <h4 className="font-medium text-gray-900">{course.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                
                {userProfile.diagnosticResults.find(r => r.courseId === course.id) ? (
                  <div className="mt-2 text-xs text-primary-600">
                    Continue Practice
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-500">
                    Take Diagnostic
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
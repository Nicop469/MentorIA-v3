import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import CourseFrameworkBuilder from '../components/CourseFrameworkBuilder';
import { useUser } from '../context/UserContext';

const TeacherOnboardingPage: React.FC = () => {
  const { userProfile } = useUser();

  const handleSaved = () => {
    alert('Course saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-2xl font-bold mb-4">Create Course</h1>
          <CourseFrameworkBuilder
            teacherId={userProfile.name}
            onSave={handleSaved}
            onCancel={() => {}}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherOnboardingPage;

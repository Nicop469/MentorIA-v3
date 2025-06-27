import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import { CourseFramework } from '../types/courseFramework';
import { useUser } from '../context/UserContext';
import CourseFrameworkBuilder from '../components/CourseFrameworkBuilder';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const TeacherDashboardPage: React.FC = () => {
  const { userProfile } = useUser();
  const [frameworks, setFrameworks] = useState<CourseFramework[]>([]);
  const [editingCourse, setEditingCourse] = useState<CourseFramework | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const loadFrameworks = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    setFrameworks(stored.filter((f: CourseFramework) => f.teacherId === userProfile.name));
  }, [userProfile.name]);

  useEffect(() => {
    loadFrameworks();
  }, [loadFrameworks]);

  const handleSave = () => {
    loadFrameworks();
    setEditingCourse(null);
    setShowBuilder(false);
  };

  const handleEdit = (course: CourseFramework) => {
    setEditingCourse(course);
    setShowBuilder(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course framework?')) return;
    const existing = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    const updated = existing.filter((f: CourseFramework) => f.id !== id);
    localStorage.setItem('courseFrameworks', JSON.stringify(updated));
    setFrameworks(updated.filter((f: CourseFramework) => f.teacherId === userProfile.name));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Create and manage your course frameworks</p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Course Frameworks</h2>
            <button
              onClick={() => { setEditingCourse(null); setShowBuilder(true); }}
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} className="mr-1" /> Create Framework
            </button>
          </div>

          {frameworks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No course frameworks created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frameworks.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(course)} className="text-primary-600 hover:text-primary-800">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="text-sm text-gray-500">
                    {course.chapters.length} chapters, {course.chapters.reduce((t, c) => t + c.concepts.length, 0)} concepts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showBuilder && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <CourseFrameworkBuilder
              course={editingCourse || undefined}
              teacherId={userProfile.name}
              onSave={handleSave}
              onCancel={() => { setShowBuilder(false); setEditingCourse(null); }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

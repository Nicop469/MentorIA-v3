import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { BookOpen, Plus, Trash2, Edit3 } from 'lucide-react';
import { Chapter } from '../types';
import { CourseFramework } from '../types/courseFramework';

const TeacherRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, userProfile } = useUser();
  
  const [step, setStep] = useState<'profile' | 'courses'>('profile');
  const [teacherName, setTeacherName] = useState(userProfile.name || '');
  const [institution, setInstitution] = useState('');
  const [courseFrameworks, setCourseFrameworks] = useState<CourseFramework[]>([]);
  
  // Current course being edited
  const [currentCourse, setCurrentCourse] = useState<CourseFramework>({
    id: '',
    name: '',
    description: '',
    chapters: [],
    teacherId: ''
  });
  
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newConcept, setNewConcept] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;
    
    updateProfile({ 
      name: teacherName.trim(),
      isTeacher: true 
    });
    
    setStep('courses');
  };

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;
    
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      number: currentCourse.chapters.length + 1,
      title: newChapterTitle.trim(),
      concepts: []
    };
    
    setCurrentCourse(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
    
    setNewChapterTitle('');
  };

  const addConcept = (chapterId: string) => {
    if (!newConcept.trim()) return;
    
    setCurrentCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId
          ? { ...chapter, concepts: [...chapter.concepts, newConcept.trim()] }
          : chapter
      )
    }));
    
    setNewConcept('');
  };

  const removeConcept = (chapterId: string, conceptIndex: number) => {
    setCurrentCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter =>
        chapter.id === chapterId
          ? { 
              ...chapter, 
              concepts: chapter.concepts.filter((_, index) => index !== conceptIndex) 
            }
          : chapter
      )
    }));
  };

  const removeChapter = (chapterId: string) => {
    setCurrentCourse(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
        .map((chapter, index) => ({ ...chapter, number: index + 1 }))
    }));
  };

  const saveCourse = () => {
    if (!currentCourse.name.trim() || currentCourse.chapters.length === 0) {
      alert('Please provide a course name and at least one chapter.');
      return;
    }

    const courseToSave: CourseFramework = {
      ...currentCourse,
      id: currentCourse.id || `course-${Date.now()}`,
      teacherId: userProfile.name
    };

    // Save to localStorage
    const existingFrameworks = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    const updatedFrameworks = currentCourse.id 
      ? existingFrameworks.map((f: CourseFramework) => f.id === currentCourse.id ? courseToSave : f)
      : [...existingFrameworks, courseToSave];
    
    localStorage.setItem('courseFrameworks', JSON.stringify(updatedFrameworks));
    setCourseFrameworks(updatedFrameworks);
    
    // Reset form
    setCurrentCourse({
      id: '',
      name: '',
      description: '',
      chapters: [],
      teacherId: ''
    });
    setShowCourseForm(false);
  };

  const editCourse = (course: CourseFramework) => {
    setCurrentCourse(course);
    setShowCourseForm(true);
  };

  const deleteCourse = (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course framework?')) return;
    
    const existingFrameworks = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    const updatedFrameworks = existingFrameworks.filter((f: CourseFramework) => f.id !== courseId);
    
    localStorage.setItem('courseFrameworks', JSON.stringify(updatedFrameworks));
    setCourseFrameworks(updatedFrameworks);
  };

  const completeRegistration = () => {
    navigate('/teacher');
  };

  React.useEffect(() => {
    // Load existing course frameworks
    const frameworks = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    setCourseFrameworks(frameworks.filter((f: CourseFramework) => f.teacherId === userProfile.name));
  }, [userProfile.name]);

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Teacher Registration
          </h1>
          
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="teacherName"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                Institution (Optional)
              </label>
              <input
                type="text"
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="University or School name"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Continue to Course Setup
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {teacherName}!
          </h1>
          <p className="text-gray-600">
            Set up your course frameworks to enable structured adaptive learning for your students.
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Course Frameworks</h2>
            <button
              onClick={() => setShowCourseForm(true)}
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Create Course Framework
            </button>
          </div>

          {courseFrameworks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                No course frameworks created yet.
              </p>
              <p className="text-sm text-gray-400">
                Create your first course framework to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseFrameworks.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editCourse(course)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="text-sm text-gray-500">
                    {course.chapters.length} chapters, {' '}
                    {course.chapters.reduce((total, chapter) => total + chapter.concepts.length, 0)} concepts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCourseForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {currentCourse.id ? 'Edit Course Framework' : 'Create Course Framework'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Accounting Fundamentals"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={currentCourse.description}
                  onChange={(e) => setCurrentCourse(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief course description"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-800">Chapters & Concepts</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Chapter title"
                  />
                  <button
                    onClick={addChapter}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add Chapter
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {currentCourse.chapters.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-900">
                        Chapter {chapter.number}: {chapter.title}
                      </h5>
                      <button
                        onClick={() => removeChapter(chapter.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={newConcept}
                          onChange={(e) => setNewConcept(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Add a concept"
                        />
                        <button
                          onClick={() => addConcept(chapter.id)}
                          className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {chapter.concepts.map((concept, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {concept}
                          <button
                            onClick={() => removeConcept(chapter.id, index)}
                            className="ml-2 text-gray-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCourseForm(false)}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCourse}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Save Course Framework
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end">
          <button
            onClick={completeRegistration}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Complete Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistrationPage;
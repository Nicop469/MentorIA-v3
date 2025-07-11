import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Target } from 'lucide-react';
import { CourseFramework } from '../types/courseFramework';

const ChapterSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  
  const [courseFramework, setCourseFramework] = useState<CourseFramework | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<string>('');

  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }

    // Load course frameworks
    const frameworks = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    const framework = frameworks.find((f: CourseFramework) => f.id === courseId);
    
    if (!framework) {
      navigate('/courses');
      return;
    }

    setCourseFramework(framework);
  }, [courseId, navigate]);

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setSelectedConcept(''); // Reset concept selection
  };

  const handleConceptSelect = (concept: string) => {
    setSelectedConcept(concept);
  };

  const startPractice = () => {
    if (!selectedChapter) {
      alert('Please select a chapter to practice.');
      return;
    }

    // Store the selected chapter and concept for the practice session
    const practiceConfig = {
      courseId,
      chapterId: selectedChapter,
      concept: selectedConcept || null,
      timestamp: Date.now()
    };
    
    localStorage.setItem('currentPracticeConfig', JSON.stringify(practiceConfig));
    navigate(`/practice/${courseId}`);
  };

  if (!courseFramework) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const selectedChapterData = courseFramework.chapters.find(c => c.id === selectedChapter);

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
            Select Chapter & Concept
          </h1>
          <p className="text-gray-600">
            Choose a specific chapter or concept from {courseFramework.name} to practice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chapter Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen size={20} className="mr-2 text-primary-600" />
              Chapters
            </h2>
            
            <div className="space-y-3">
              {courseFramework.chapters.map((chapter) => (
                <motion.div
                  key={chapter.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedChapter === chapter.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleChapterSelect(chapter.id)}
                >
                  <h3 className="font-medium text-gray-900">
                    Chapter {chapter.number}: {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {chapter.concepts.length} concepts available
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Concept Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target size={20} className="mr-2 text-primary-600" />
              Concepts
            </h2>
            
            {!selectedChapter ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Select a chapter to view available concepts
                </p>
              </div>
            ) : selectedChapterData?.concepts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No specific concepts defined for this chapter
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  You can practice the entire chapter
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedConcept === ''
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleConceptSelect('')}
                >
                  <p className="font-medium text-gray-900">
                    All Concepts (Entire Chapter)
                  </p>
                </motion.div>
                
                {selectedChapterData?.concepts.map((concept, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedConcept === concept
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConceptSelect(concept)}
                  >
                    <p className="font-medium text-gray-900">{concept}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Practice Summary */}
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Practice Summary</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Course:</strong> {courseFramework.name}
              </p>
              <p className="text-gray-700">
                <strong>Chapter:</strong> {selectedChapterData?.title}
              </p>
              {selectedConcept && (
                <p className="text-gray-700">
                  <strong>Concept:</strong> {selectedConcept}
                </p>
              )}
              {!selectedConcept && selectedChapterData && (
                <p className="text-gray-700">
                  <strong>Scope:</strong> All concepts in this chapter
                </p>
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
                onClick={startPractice}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Start Adaptive Practice
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChapterSelectionPage;
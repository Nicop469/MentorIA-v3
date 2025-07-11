import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Question, QuestionAttempt, PracticeSession } from '../types';
import { getCourses } from '../services/storageService';
import { selectNextQuestion, adjustDifficulty } from '../utils/adaptiveLogic';
import QuestionCard from '../components/QuestionCard';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import { v4 as uuidv4 } from 'uuid';

const MAX_PRACTICE_QUESTIONS = 20;

const PracticeModePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { userProfile, addPracticeSession } = useUser();
  
  const [courseName, setCourseName] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(5);
  const [startingDifficulty, setStartingDifficulty] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState<boolean>(false);
  
  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    // Get course name
    const courses = getCourses();
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setCourseName(course.name);
    } else {
      navigate('/courses');
      return;
    }
    
    // Get starting difficulty from diagnostic results if available
    const diagnosticResult = userProfile.diagnosticResults.find(r => r.courseId === courseId);
    if (diagnosticResult) {
      const difficulty = diagnosticResult.skillLevel;
      setCurrentDifficulty(difficulty);
      setStartingDifficulty(difficulty);
    }
    
    // Initialize with first question
    loadNextQuestion();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, navigate, userProfile.diagnosticResults]);
  
  const loadNextQuestion = () => {
    if (!courseId) return;
    
    setIsLoading(true);
    
    if (attempts.length >= MAX_PRACTICE_QUESTIONS) {
      completePractice();
      return;
    }
    
    const question = selectNextQuestion(courseId, currentDifficulty, askedQuestions);
    if (!question) {
      completePractice();
      return;
    }
    
    setCurrentQuestion(question);
    setAskedQuestions(prev => [...prev, question.id]);
    setIsLoading(false);
  };
  
  const handleAnswer = (attempt: QuestionAttempt) => {
    setAttempts(prev => [...prev, attempt]);
    
    // Adjust difficulty for next question
    const newDifficulty = adjustDifficulty(
      currentDifficulty,
      attempt.correct,
      attempt.timeTaken,
      currentQuestion?.targetTime || 60
    );
    
    setCurrentDifficulty(newDifficulty);
    
    // Move to next question after a short delay
    setTimeout(() => {
      loadNextQuestion();
    }, 2000);
  };
  
  const completePractice = () => {
    if (!courseId || attempts.length === 0) return;
    
    const correctCount = attempts.filter(a => a.correct).length;
    const totalTime = attempts.reduce((sum, a) => sum + a.timeTaken, 0);
    
    const practiceSession: PracticeSession = {
      id: uuidv4(),
      courseId,
      date: new Date().toISOString(),
      attempts,
      averageTime: Number((totalTime / attempts.length).toFixed(2)),
      correctPercentage: Number(((correctCount / attempts.length) * 100).toFixed(2)),
      startingLevel: startingDifficulty,
      endingLevel: currentDifficulty,
    };
    
    addPracticeSession(practiceSession);
    setIsPracticeComplete(true);
    
    // Navigate to summary after a short delay
    setTimeout(() => {
      navigate(`/summary/${practiceSession.id}`);
    }, 1500);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Mode</h1>
          <p className="text-gray-600">
            {courseName} - Adaptive practice session ({attempts.length}/{MAX_PRACTICE_QUESTIONS} questions completed)
          </p>
        </motion.div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {attempts.length}/{MAX_PRACTICE_QUESTIONS}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(attempts.length / MAX_PRACTICE_QUESTIONS) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Current difficulty:</span>
            <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded">
              Level {currentDifficulty}/10
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Correct answers:</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded">
              {attempts.filter(a => a.correct).length}/{attempts.length}
            </span>
          </div>
        </div>
        
        {isLoading && !isPracticeComplete && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}
        
        {!isLoading && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={attempts.length + 1}
            totalQuestions={MAX_PRACTICE_QUESTIONS}
          />
        )}
        
        {isPracticeComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Practice Complete!</h2>
          <p className="text-gray-600 mb-6">
            Analyzing your results and preparing your performance summary...
          </p>
          <LoadingSpinner className="mx-auto" />
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default PracticeModePage;
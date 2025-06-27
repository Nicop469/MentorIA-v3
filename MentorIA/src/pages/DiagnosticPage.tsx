import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Question, QuestionAttempt, DiagnosticResult } from '../types';
import { getCourses } from '../services/storageService';
import { selectNextQuestion, adjustDifficulty, calculateMetrics } from '../utils/adaptiveLogic';
import QuestionCard from '../components/QuestionCard';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';

const MAX_DIAGNOSTIC_QUESTIONS = 5;

const DiagnosticPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { addDiagnosticResult } = useUser();
  
  const [courseName, setCourseName] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(5); // Start at medium difficulty
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDiagnosticComplete, setIsDiagnosticComplete] = useState<boolean>(false);
  
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
    
    // Initialize with first question
    loadNextQuestion();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, navigate]);
  
  const loadNextQuestion = () => {
    if (!courseId) return;
    
    setIsLoading(true);
    
    if (attempts.length >= MAX_DIAGNOSTIC_QUESTIONS) {
      completeDiagnostic();
      return;
    }
    
    const question = selectNextQuestion(courseId, currentDifficulty, askedQuestions);
    if (!question) {
      completeDiagnostic();
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
  
  const completeDiagnostic = () => {
    if (!courseId || attempts.length === 0) return;
    
    const metrics = calculateMetrics(attempts);
    
    const diagnosticResult: DiagnosticResult = {
      courseId,
      skillLevel: metrics.skillLevel,
      attempts,
      averageTime: metrics.averageTime,
      correctPercentage: metrics.correctPercentage,
    };
    
    addDiagnosticResult(diagnosticResult);
    setIsDiagnosticComplete(true);
    
    // Navigate to results after a short delay
    setTimeout(() => {
      navigate(`/results/${courseId}`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Assessment</h1>
          <p className="text-gray-600">
            {courseName ? `${courseName} - ` : ''}
            Complete {MAX_DIAGNOSTIC_QUESTIONS} questions to determine your skill level
          </p>
        </motion.div>
        
        <div className="mb-6 flex items-center">
          <div className="flex-grow bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full"
              style={{ width: `${(attempts.length / MAX_DIAGNOSTIC_QUESTIONS) * 100}%` }}
            ></div>
          </div>
          <span className="ml-4 text-sm font-medium text-gray-700">
            {attempts.length}/{MAX_DIAGNOSTIC_QUESTIONS}
          </span>
        </div>
        
        {isLoading && !isDiagnosticComplete && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {!isLoading && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={attempts.length + 1}
            totalQuestions={MAX_DIAGNOSTIC_QUESTIONS}
          />
        )}
        
        {isDiagnosticComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Diagnostic Complete!</h2>
            <p className="text-gray-600 mb-6">
              Analyzing your results and preparing your personalized learning path...
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPage;
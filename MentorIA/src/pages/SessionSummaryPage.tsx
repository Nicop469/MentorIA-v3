import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PracticeSession, QuestionAttempt } from '../types';
import { useUser } from '../context/UserContext';
import Navigation from '../components/Navigation';
import PerformanceChart from '../components/PerformanceChart';
import { Home, RefreshCcw, TrendingUp, Award } from 'lucide-react';

const SessionSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { userProfile } = useUser();
  
  const [session, setSession] = useState<PracticeSession | null>(null);
  
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    
    // Find practice session
    const practiceSession = userProfile.practiceSessions.find(s => s.id === sessionId);
    
    if (!practiceSession) {
      navigate('/');
      return;
    }
    
    setSession(practiceSession);
  }, [sessionId, navigate, userProfile.practiceSessions]);
  
  const renderAttemptRow = (attempt: QuestionAttempt, index: number) => {
    return (
      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {index + 1}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {attempt.difficulty}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {attempt.timeTaken}s
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${attempt.correct 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'}`}>
            {attempt.correct ? 'Correct' : 'Incorrect'}
          </span>
        </td>
      </tr>
    );
  };
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  const skillChange = session.endingLevel - session.startingLevel;
  
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Session Summary</h1>
          <p className="text-gray-600">
            Review your performance and progress from this practice session
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Skill Progress</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              {session.startingLevel} → {session.endingLevel}
              <span className={`ml-2 text-sm ${
                skillChange > 0 
                  ? 'text-green-600' 
                  : skillChange < 0 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                ({skillChange > 0 ? '+' : ''}{skillChange} levels)
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <Award size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Accuracy</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {session.correctPercentage}%
            </div>
            <p className="text-gray-600 text-sm">
              {session.correctPercentage >= 80 
                ? 'Excellent understanding' 
                : session.correctPercentage >= 60 
                ? 'Good grasp of concepts' 
                : 'Room for improvement'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <RefreshCcw size={20} />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Practice Stats</h3>
            </div>
            <div className="text-lg font-medium text-gray-900 mb-1">
              {session.attempts.length} questions
            </div>
            <p className="text-gray-600 text-sm">
              Average time: {session.averageTime} seconds per question
            </p>
          </motion.div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Chart</h3>
          <PerformanceChart attempts={session.attempts} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Details</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Taken
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {session.attempts.map(renderAttemptRow)}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/practice/${session.courseId}`)}
            className="inline-flex items-center bg-primary-600 text-white font-medium py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
          >
            <RefreshCcw size={18} className="mr-2" />
            Practice Again
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummaryPage;
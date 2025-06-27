import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VARKAnswer, VARKStyle } from '../types';
import { varkQuestions } from '../data/varkQuestions';
import Navigation from '../components/Navigation';
import { ClipboardCheck } from 'lucide-react';

const VARKQuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [answers, setAnswers] = useState<VARKAnswer[]>([]);

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, score } : a);
      }
      return [...prev, { questionId, score }];
    });
  };

  const calculateDominantStyle = (): VARKStyle => {
    const scores = {
      visual: 0,
      aural: 0,
      read: 0,
      kinesthetic: 0
    };

    answers.forEach(answer => {
      const question = varkQuestions.find(q => q.id === answer.questionId);
      if (question) {
        scores[question.style] += answer.score;
      }
    });

    let maxScore = 0;
    let dominantStyles: VARKStyle[] = [];

    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantStyles = [style as VARKStyle];
      } else if (score === maxScore) {
        dominantStyles.push(style as VARKStyle);
      }
    });

    return dominantStyles[Math.floor(Math.random() * dominantStyles.length)];
  };

  const handleSubmit = () => {
    if (answers.length < varkQuestions.length) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    const dominantStyle = calculateDominantStyle();
    localStorage.setItem(`vark_${courseId}`, dominantStyle);
    
    navigate(`/diagnostic/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Style Questionnaire</h1>
          <p className="text-gray-600">
            Help us understand how you learn best by answering these quick questions.
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {varkQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-8 last:mb-0"
            >
              <p className="text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.text}
              </p>

              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="relative flex flex-col items-center"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={score}
                      onChange={() => handleAnswerChange(question.id, score)}
                      className="sr-only"
                    />
                    <div
                      className={`w-full py-2 text-center rounded cursor-pointer transition-colors ${
                        answers.find(a => a.questionId === question.id)?.score === score
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {score === 1 ? 'Strongly Disagree' :
                       score === 2 ? 'Disagree' :
                       score === 3 ? 'Neutral' :
                       score === 4 ? 'Agree' :
                       'Strongly Agree'}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={handleSubmit}
              disabled={answers.length < varkQuestions.length}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-md text-white font-medium transition-colors ${
                answers.length < varkQuestions.length
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              <ClipboardCheck size={20} className="mr-2" />
              Submit and Continue to Diagnostic
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VARKQuestionnairePage;
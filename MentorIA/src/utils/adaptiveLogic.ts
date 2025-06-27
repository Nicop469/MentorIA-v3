import { Question, QuestionAttempt } from '../types';
import { getQuestionsByDifficulty } from '../services/storageService';

// Adjust difficulty based on performance
export const adjustDifficulty = (
  currentDifficulty: number,
  isCorrect: boolean,
  timeTaken: number,
  targetTime: number
): number => {
  // If correct and fast, increase difficulty
  if (isCorrect && timeTaken < targetTime * 0.8) {
    return Math.min(currentDifficulty + 1, 10);
  }
  
  // If incorrect or too slow, decrease difficulty
  if (!isCorrect || timeTaken > targetTime * 1.2) {
    return Math.max(currentDifficulty - 1, 1);
  }
  
  // Otherwise keep the same difficulty
  return currentDifficulty;
};

// Select next question based on difficulty and practice configuration
export const selectNextQuestion = (
  courseId: string, 
  difficulty: number, 
  previousQuestions: string[] = []
): Question | null => {
  // Check if there's a specific practice configuration
  const practiceConfig = localStorage.getItem('currentPracticeConfig');
  let filteredQuestions: Question[] = [];
  
  if (practiceConfig) {
    const config = JSON.parse(practiceConfig);
    
    if (config.courseId === courseId && config.chapterId) {
      // This is a structured course practice session
      filteredQuestions = getQuestionsByChapterAndConcept(
        config.courseId,
        config.chapterId,
        config.concept,
        difficulty
      );
    }
  }
  
  // Fallback to standard question selection if no structured questions found
  if (filteredQuestions.length === 0) {
    filteredQuestions = getQuestionsByDifficulty(courseId, difficulty);
  }
  
  // Filter out previously asked questions
  filteredQuestions = filteredQuestions.filter(q => !previousQuestions.includes(q.id));
  
  // If no questions at this difficulty, try adjacent difficulties
  if (filteredQuestions.length === 0) {
    for (let diff = 1; diff <= 10; diff++) {
      if (diff !== difficulty) {
        const altQuestions = getQuestionsByDifficulty(courseId, diff)
          .filter(q => !previousQuestions.includes(q.id));
        
        if (altQuestions.length > 0) {
          filteredQuestions = altQuestions;
          break;
        }
      }
    }
  }
  
  // Return a random question from the filtered list
  if (filteredQuestions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

// Get questions filtered by chapter and concept
const getQuestionsByChapterAndConcept = (
  courseId: string,
  chapterId: string,
  concept: string | null,
  difficulty: number
): Question[] => {
  // For now, return questions from the general pool
  // In a real implementation, questions would be tagged with chapter/concept metadata
  const allQuestions = getQuestionsByDifficulty(courseId, difficulty);
  
  // TODO: Implement proper filtering based on chapter and concept tags
  // This would require extending the Question type to include chapter/concept metadata
  
  return allQuestions;
};

// Calculate performance metrics
export const calculateMetrics = (attempts: QuestionAttempt[]): { 
  averageTime: number;
  correctPercentage: number;
  skillLevel: number;
} => {
  if (attempts.length === 0) {
    return { averageTime: 0, correctPercentage: 0, skillLevel: 0 };
  }
  
  const totalTime = attempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
  const correctCount = attempts.filter(attempt => attempt.correct).length;
  
  const averageTime = Number((totalTime / attempts.length).toFixed(2));
  const correctPercentage = Number(((correctCount / attempts.length) * 100).toFixed(2));
  
  // Calculate skill level as weighted average of difficulties of correct answers
  const correctAttempts = attempts.filter(attempt => attempt.correct);
  const skillLevel = correctAttempts.length > 0 
    ? Math.round(correctAttempts.reduce((sum, attempt) => sum + attempt.difficulty, 0) / correctAttempts.length) 
    : Math.round(attempts[attempts.length - 1].difficulty / 2); // If no correct answers, estimate as half of last difficulty
  
  return {
    averageTime,
    correctPercentage,
    skillLevel: Math.min(Math.max(skillLevel, 1), 10), // Ensure between 1-10
  };
};

// Generate feedback based on answer
export const generateFeedback = (isCorrect: boolean, timeTaken: number, targetTime: number): string => {
  if (!isCorrect) {
    return 'Incorrecto. Revisa tu trabajo e intenta de nuevo.';
  }
  
  if (timeTaken < targetTime * 0.5) {
    return '¡Excelente! Resolviste esto muy r\u00e1pido.';
  }
  
  if (timeTaken < targetTime * 0.8) {
    return '\u00a1Buen trabajo! Resolviste esto eficientemente.';
  }
  
  if (timeTaken < targetTime * 1.1) {
    return 'Bien hecho. Completaste esto dentro del tiempo esperado.';
  }
  
  return 'Correcto. Podr\u00edas practicar problemas similares para mejorar tu velocidad.';
};
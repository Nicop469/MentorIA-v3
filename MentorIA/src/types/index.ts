export interface Course {
  id: string;
  name: string;
  description: string;
  classes?: CourseClass[];
  /**
   * Optional structured chapters for teacher-designed courses.
   */
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  concepts: string[];
}

export interface CourseClass {
  id: string;
  number: number;
  title: string;
  description: string;
  content: string;
}

export interface Question {
  id: string;
  courseId: string;
  statement: string;
  options?: string[];
  correctAnswer: string;
  difficulty: number;
  targetTime: number;
}

export interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  timeTaken: number;
  difficulty: number;
}

export interface DiagnosticResult {
  courseId: string;
  skillLevel: number;
  attempts: QuestionAttempt[];
  averageTime: number;
  correctPercentage: number;
  varkStyle?: VARKStyle;
}

export interface PracticeSession {
  id: string;
  courseId: string;
  date: string;
  attempts: QuestionAttempt[];
  averageTime: number;
  correctPercentage: number;
  startingLevel: number;
  endingLevel: number;
}

export interface UserProfile {
  name: string;
  isTeacher: boolean;
  diagnosticResults: DiagnosticResult[];
  practiceSessions: PracticeSession[];
}

export type VARKStyle = 'visual' | 'aural' | 'read' | 'kinesthetic';

export interface VARKQuestion {
  id: string;
  text: string;
  style: VARKStyle;
}

export interface VARKAnswer {
  questionId: string;
  score: number; // 1-5 for Strongly Disagree to Strongly Agree
}
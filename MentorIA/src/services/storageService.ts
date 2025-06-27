import { Course, Question, UserProfile } from '../types';
import { initialCourses, initialQuestions, initialUserProfile } from '../data/initialData';

const STORAGE_KEYS = {
  USER_PROFILE: 'eduprofile_user',
  COURSES: 'eduprofile_courses',
  QUESTIONS: 'eduprofile_questions',
};

// User Profile
export const getUserProfile = (): UserProfile => {
  const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }
  return initialUserProfile;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const updateUserName = (name: string): UserProfile => {
  const profile = getUserProfile();
  profile.name = name;
  saveUserProfile(profile);
  return profile;
};

// Courses
export const getCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (storedCourses) {
    return JSON.parse(storedCourses);
  }
  
  // Initialize with default courses if none exist
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
  return initialCourses;
};

export const saveCourse = (course: Course): void => {
  const courses = getCourses();
  const existingIndex = courses.findIndex(c => c.id === course.id);
  
  if (existingIndex >= 0) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }
  
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
};

export const deleteCourse = (courseId: string): void => {
  let courses = getCourses();
  courses = courses.filter(c => c.id !== courseId);
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  let questions = getQuestions();
  questions = questions.filter(q => q.courseId !== courseId);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

// Questions
export const getQuestions = (): Question[] => {
  const storedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  if (storedQuestions) {
    return JSON.parse(storedQuestions);
  }
  
  // Initialize with default questions if none exist
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(initialQuestions));
  return initialQuestions;
};

export const getQuestionsByCourse = (courseId: string): Question[] => {
  const questions = getQuestions();
  return questions.filter(q => q.courseId === courseId);
};

export const getQuestionsByDifficulty = (courseId: string, difficulty: number): Question[] => {
  const questions = getQuestions();
  return questions.filter(q => q.courseId === courseId && q.difficulty === difficulty);
};

export const saveQuestion = (question: Question): void => {
  const questions = getQuestions();
  const existingIndex = questions.findIndex(q => q.id === question.id);
  
  if (existingIndex >= 0) {
    questions[existingIndex] = question;
  } else {
    questions.push(question);
  }
  
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const deleteQuestion = (questionId: string): void => {
  let questions = getQuestions();
  questions = questions.filter(q => q.id !== questionId);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

// Initialize storage with default data
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(initialQuestions));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(initialUserProfile));
  }
};
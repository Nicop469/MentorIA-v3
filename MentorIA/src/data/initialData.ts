import { Course, Question, UserProfile } from '../types';

export const initialCourses: Course[] = [
  {
    id: 'arithmetic',
    name: 'Aritm\u00e9tica',
    description: 'Conceptos y operaciones aritm\u00e9ticas b\u00e1sicas',
  },
  {
    id: 'algebra',
    name: '\u00c1lgebra',
    description: 'Resoluci\u00f3n de ecuaciones y uso de variables',
  },
  {
    id: 'geometry',
    name: 'Geometr\u00eda',
    description: 'Introducci\u00f3n a la geometr\u00eda euclidiana',
  },
  {
    id: 'calculus',
    name: 'C\u00e1lculo',
    description: 'Derivadas, integrales y sus aplicaciones',
  },
  {
    id: 'probability',
    name: 'Probabilidad',
    description: 'Comprender el azar y los eventos aleatorios',
  },
  {
    id: 'statistics',
    name: 'Estad\u00edstica',
    description: 'An\u00e1lisis e interpretaci\u00f3n de datos',
  },
  {
    id: 'accounting',
    name: 'Contabilidad',
    description: 'Curso de contabilidad b\u00e1sica',
  },
];

export const initialQuestions: Question[] = [
  // Arithmetic questions (difficulty 1-10)
  {
    id: 'arith-1',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1nto es 7 \u00d7 8?',
    correctAnswer: '56',
    difficulty: 2,
    targetTime: 20,
  },
  {
    id: 'arith-2',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1nto es 12 \u00d7 15?',
    correctAnswer: '180',
    difficulty: 3,
    targetTime: 30,
  },
  {
    id: 'arith-3',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1nto es 7 \u00d7 8 - (3 + 5)?',
    correctAnswer: '48',
    difficulty: 4,
    targetTime: 40,
  },
  {
    id: 'arith-4',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1nto es 356 + 289?',
    correctAnswer: '645',
    difficulty: 5,
    targetTime: 45,
  },
  {
    id: 'arith-5',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1nto es 729 \u00f7 9?',
    correctAnswer: '81',
    difficulty: 6,
    targetTime: 50,
  },
  {
    id: 'arith-6',
    courseId: 'arithmetic',
    statement: '\u00bfCu\u00e1l es el resultado de 15% de 240?',
    correctAnswer: '36',
    difficulty: 7,
    targetTime: 60,
  },
  {
    id: 'arith-7',
    courseId: 'arithmetic',
    statement: 'Si un n\u00famero aumenta un 20% y luego disminuye un 25%, \u00bfcu\u00e1l es el cambio porcentual total?',
    correctAnswer: '-10',
    difficulty: 8,
    targetTime: 90,
  },
  
  // Algebra questions
  {
    id: 'alg-1',
    courseId: 'algebra',
    statement: 'Resuelve para x: 3x + 5 = 20',
    correctAnswer: '5',
    difficulty: 3,
    targetTime: 40,
  },
  {
    id: 'alg-2',
    courseId: 'algebra',
    statement: 'Resuelve para x: 2x - 7 = 13',
    correctAnswer: '10',
    difficulty: 4,
    targetTime: 45,
  },
  {
    id: 'alg-3',
    courseId: 'algebra',
    statement: 'Simplifica: 3(2x - 5) + 4(x + 3)',
    correctAnswer: '10x - 3',
    difficulty: 5,
    targetTime: 60,
  },
  {
    id: 'alg-4',
    courseId: 'algebra',
    statement: 'Resuelve el sistema: x + y = 5, x - y = 3',
    correctAnswer: 'x = 4, y = 1',
    difficulty: 6,
    targetTime: 90,
  },
  {
    id: 'alg-5',
    courseId: 'algebra',
    statement: 'Resuelve la ecuaci\u00f3n cuadr\u00e1tica: x\u00b2 - 5x + 6 = 0',
    correctAnswer: 'x = 2, x = 3',
    difficulty: 7,
    targetTime: 120,
  },
  
  // Geometry questions
  {
    id: 'geom-1',
    courseId: 'geometry',
    statement: '\u00bfCu\u00e1l es el \u00e1rea de un rect\u00e1ngulo de ancho 6 y largo 9?',
    correctAnswer: '54',
    difficulty: 3,
    targetTime: 30,
  },
  {
    id: 'geom-2',
    courseId: 'geometry',
    statement: '\u00bfCu\u00e1l es el \u00e1rea de un c\u00edrculo de radio 5?',
    correctAnswer: '25π',
    difficulty: 4,
    targetTime: 45,
  },
  {
    id: 'geom-3',
    courseId: 'geometry',
    statement: 'Si un tri\u00e1ngulo tiene lados de 3, 4 y 5, \u00bfcu\u00e1l es su \u00e1rea?',
    correctAnswer: '6',
    difficulty: 5,
    targetTime: 60,
  },
  
  // Calculus questions
  {
    id: 'calc-1',
    courseId: 'calculus',
    statement: '\u00bfCu\u00e1l es la derivada de f(x) = 3x\u00b2 + 5x?',
    correctAnswer: '6x + 5',
    difficulty: 5,
    targetTime: 60,
  },
  {
    id: 'calc-2',
    courseId: 'calculus',
    statement: '\u00bfCu\u00e1l es la derivada de f(x) = e^x?',
    correctAnswer: 'e^x',
    difficulty: 6,
    targetTime: 50,
  },
  {
    id: 'calc-3',
    courseId: 'calculus',
    statement: 'Eval\u00faa la integral definida \u222b\u2080\u00b9 x\u00b2 dx',
    correctAnswer: '1/3',
    difficulty: 7,
    targetTime: 90,
  },
];

export const initialUserProfile: UserProfile = {
  name: '',
  isTeacher: false,
  diagnosticResults: [],
  practiceSessions: [],
};
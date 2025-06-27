import { Chapter } from './index';

export interface CourseFramework {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  teacherId: string;
}

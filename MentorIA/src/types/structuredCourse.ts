export interface Concept {
  id: string;
  title: string;
}

export interface Subtopic {
  id: string;
  title: string;
  concepts: Concept[];
}

export interface Chapter {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

export interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
}

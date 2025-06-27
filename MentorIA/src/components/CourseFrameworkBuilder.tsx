import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChapterForm from './ChapterForm';
import { Chapter as StructuredChapter } from '../types/structuredCourse';
import { CourseFramework } from '../types/courseFramework';

interface Props {
  course?: CourseFramework;
  teacherId: string;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Builder component used to create or edit a course framework.
 * Internally it uses the structured chapter forms from the onboarding page
 * but persists data in the simpler CourseFramework format expected by the
 * rest of the application.
 */
const CourseFrameworkBuilder: React.FC<Props> = ({ course, teacherId, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapters, setChapters] = useState<StructuredChapter[]>([]);

  useEffect(() => {
    if (course) {
      setTitle(course.name);
      setDescription(course.description);
      // Convert simple chapter data to structured form
      setChapters(
        course.chapters.map((c) => ({
          id: c.id,
          title: c.title,
          subtopics: [
            {
              id: uuidv4(),
              title: 'Concepts',
              concepts: c.concepts.map((concept) => ({ id: uuidv4(), title: concept }))
            }
          ]
        }))
      );
    } else {
      setTitle('');
      setDescription('');
      setChapters([]);
    }
  }, [course]);

  const handleChapterChange = (index: number, updated: StructuredChapter) => {
    const newChapters = [...chapters];
    newChapters[index] = updated;
    setChapters(newChapters);
  };

  const addChapter = () => {
    setChapters([...chapters, { id: uuidv4(), title: '', subtopics: [] }]);
  };

  const deleteChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const framework: CourseFramework = {
      id: course?.id || uuidv4(),
      name: title,
      description,
      chapters: chapters.map((c, idx) => ({
        id: c.id,
        number: idx + 1,
        title: c.title,
        concepts: c.subtopics.flatMap((s) => s.concepts.map((cn) => cn.title))
      })),
      teacherId
    };

    // Persist in localStorage
    const existing = JSON.parse(localStorage.getItem('courseFrameworks') || '[]');
    const updated = course
      ? existing.map((f: CourseFramework) => (f.id === framework.id ? framework : f))
      : [...existing, framework];
    localStorage.setItem('courseFrameworks', JSON.stringify(updated));

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Course Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Chapters</h2>
        {chapters.map((chapter, index) => (
          <ChapterForm
            key={chapter.id}
            chapter={chapter}
            onChange={(c) => handleChapterChange(index, c)}
            onDelete={() => deleteChapter(index)}
          />
        ))}
        <button type="button" onClick={addChapter} className="text-sm text-primary-600">
          + Add Chapter
        </button>
      </div>

      <div className="pt-4 flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          Save Course
        </button>
      </div>
    </form>
  );
};

export default CourseFrameworkBuilder;

import React from 'react';
import { Chapter, Subtopic } from '../types/structuredCourse';
import SubtopicForm from './SubtopicForm';
import { v4 as uuidv4 } from 'uuid';

interface ChapterFormProps {
  chapter: Chapter;
  onChange: (chapter: Chapter) => void;
  onDelete: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ chapter, onChange, onDelete }) => {
  const handleSubtopicChange = (index: number, updated: Subtopic) => {
    const newSubtopics = [...chapter.subtopics];
    newSubtopics[index] = updated;
    onChange({ ...chapter, subtopics: newSubtopics });
  };

  const addSubtopic = () => {
    onChange({
      ...chapter,
      subtopics: [...chapter.subtopics, { id: uuidv4(), title: '', concepts: [] }],
    });
  };

  const deleteSubtopic = (index: number) => {
    const newSubtopics = chapter.subtopics.filter((_, i) => i !== index);
    onChange({ ...chapter, subtopics: newSubtopics });
  };

  return (
    <div className="p-4 border rounded-lg mb-6">
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onChange({ ...chapter, title: e.target.value })}
          placeholder="Chapter title"
          className="flex-1 p-2 border rounded-lg"
        />
        <button type="button" onClick={onDelete} className="ml-2 text-red-600">
          Remove
        </button>
      </div>
      {chapter.subtopics.map((subtopic, index) => (
        <SubtopicForm
          key={subtopic.id}
          subtopic={subtopic}
          onChange={(s) => handleSubtopicChange(index, s)}
          onDelete={() => deleteSubtopic(index)}
        />
      ))}
      <button type="button" onClick={addSubtopic} className="text-sm text-primary-600 mt-2">
        + Add Subtopic
      </button>
    </div>
  );
};

export default ChapterForm;

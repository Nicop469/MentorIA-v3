import React from 'react';
import { Chapter, Subtopic } from '../types/structuredCourse';
import SubtopicForm from './SubtopicForm';
import { v4 as uuidv4 } from 'uuid';
import Card from './ui/Card';
import Button from './ui/Button';

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
    <Card className="p-4 mb-6 space-y-4">
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onChange({ ...chapter, title: e.target.value })}
          placeholder="Chapter title"
          className="flex-1 p-2 border rounded-lg"
        />
        <Button type="button" onClick={onDelete} className="ml-2 bg-red-600 hover:bg-red-700">
          Remove
        </Button>
      </div>
      {chapter.subtopics.map((subtopic, index) => (
        <SubtopicForm
          key={subtopic.id}
          subtopic={subtopic}
          onChange={(s) => handleSubtopicChange(index, s)}
          onDelete={() => deleteSubtopic(index)}
        />
      ))}
      <Button type="button" onClick={addSubtopic} className="text-sm mt-2">
        + Add Subtopic
      </Button>
    </Card>
  );
};

export default ChapterForm;

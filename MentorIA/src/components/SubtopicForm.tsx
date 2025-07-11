import React from 'react';
import { Subtopic, Concept } from '../types/structuredCourse';
import ConceptForm from './ConceptForm';
import { v4 as uuidv4 } from 'uuid';
import Card from './ui/Card';
import Button from './ui/Button';

interface SubtopicFormProps {
  subtopic: Subtopic;
  onChange: (subtopic: Subtopic) => void;
  onDelete: () => void;
}

const SubtopicForm: React.FC<SubtopicFormProps> = ({ subtopic, onChange, onDelete }) => {
  const handleConceptChange = (index: number, updated: Concept) => {
    const newConcepts = [...subtopic.concepts];
    newConcepts[index] = updated;
    onChange({ ...subtopic, concepts: newConcepts });
  };

  const addConcept = () => {
    onChange({
      ...subtopic,
      concepts: [...subtopic.concepts, { id: uuidv4(), title: '' }],
    });
  };

  const deleteConcept = (index: number) => {
    const newConcepts = subtopic.concepts.filter((_, i) => i !== index);
    onChange({ ...subtopic, concepts: newConcepts });
  };

  return (
    <Card className="p-4 mb-4 space-y-2">
      <div className="flex justify-between items-center mb-2">
        <input
          type="text"
          value={subtopic.title}
          onChange={(e) => onChange({ ...subtopic, title: e.target.value })}
          placeholder="Subtopic title"
          className="flex-1 p-2 border rounded-lg"
        />
        <Button type="button" onClick={onDelete} className="ml-2 bg-red-600 hover:bg-red-700">
          Remove
        </Button>
      </div>
      {subtopic.concepts.map((concept, index) => (
        <ConceptForm
          key={concept.id}
          concept={concept}
          onChange={(c) => handleConceptChange(index, c)}
          onDelete={() => deleteConcept(index)}
        />
      ))}
      <Button type="button" onClick={addConcept} className="text-sm mt-2">
        + Add Concept
      </Button>
    </Card>
  );
};

export default SubtopicForm;

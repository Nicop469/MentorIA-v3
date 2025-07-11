import React from 'react';
import { Concept } from '../types/structuredCourse';
import Button from './ui/Button';

interface ConceptFormProps {
  concept: Concept;
  onChange: (concept: Concept) => void;
  onDelete: () => void;
}

const ConceptForm: React.FC<ConceptFormProps> = ({ concept, onChange, onDelete }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={concept.title}
        onChange={(e) => onChange({ ...concept, title: e.target.value })}
        placeholder="Concept title"
        className="flex-1 p-2 border rounded-lg"
      />
      <Button type="button" onClick={onDelete} className="ml-2 bg-red-600 hover:bg-red-700">
        Remove
      </Button>
    </div>
  );
};

export default ConceptForm;

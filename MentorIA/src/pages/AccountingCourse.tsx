import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import ExerciseDetail from '../components/ExerciseDetail';

interface Exercise {
  case_id?: string;
  id?: string;
  item_id?: string;
  title?: string;
  [key: string]: any;
}

/**
 * AccountingCourse
 * -----------------
 * Page that loads accounting practice exercises from a JSON file and
 * displays them with a simple side navigation. Students can type their
 * answers which are stored in component state. A "Submit" button prints
 * all answers to the console.
 */
export default function AccountingCourse(): JSX.Element {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  // Load JSON on mount
  useEffect(() => {
    fetch('/preguntas-contabilidad.json')
      .then((res) => res.json())
      .then((data: Exercise[] | Exercise) => {
        // Support object or array structure
        if (Array.isArray(data)) {
          setExercises(data);
        } else if (data) {
          setExercises([data]);
        }
      })
      .catch((err) => {
        console.error('Failed to load accounting questions:', err);
      });
  }, []);

  const selectedExercise: Exercise | undefined = exercises.find(
    (ex, idx) => (ex.case_id || ex.id || idx) === selectedId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Side navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
          <h2 className="text-lg font-semibold mb-4">Exercises</h2>
          <ul className="space-y-2">
            {exercises.map((ex, idx) => {
              const id = ex.case_id || ex.id || idx;
              const title = ex.title || ex.item_id || `Ejercicio ${idx + 1}`;
              return (
                <li key={id}>
                  <button
                    onClick={() => setSelectedId(id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedId === id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {title}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Detail view */}
        <main className="flex-1 p-4 space-y-4">
          {selectedExercise ? (
            <ExerciseDetail exercise={selectedExercise} />
          ) : (
            <p className="text-gray-500">Select an exercise from the list.</p>
          )}
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import ExerciseDetail from '../components/ExerciseDetail';

interface Exercise {
  case_id?: string;
  id?: string;
  item_id?: string;
  title?: string;
  [key: string]: unknown;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load JSON on mount
  useEffect(() => {
    // Define async function so we can use try/catch
    const loadExercises = async (): Promise<void> => {
      // Start loading state before fetch
      setLoading(true);
      try {
        // Fetch accounting practice questions JSON
        const res = await fetch('/preguntas-contabilidad.json');
        // Throw error if response is not OK
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        // Parse JSON content
        const data: Exercise[] | Exercise = await res.json();
        // Support object or array structure when saving
        if (Array.isArray(data)) {
          setExercises(data);
        } else if (data) {
          setExercises([data]);
        }
        // Clear any previous error
        setError(null);
      } catch (err) {
        // Log error and display friendly message
        console.error('Failed to load accounting questions:', err);
        setError('Error loading exercises. Please try again.');
      } finally {
        // Stop loading state after fetch completes
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const selectedExercise: Exercise | undefined = exercises.find(
    (ex, idx) => (ex.case_id || ex.id || idx) === selectedId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Contabilidad</h1>
        {loading && (
          <p className="text-gray-500">Cargando ejercicios...</p>
        )}
        {error && !loading && (
          <p className="text-red-600 mb-4">{error}</p>
        )}
      </div>
      <div className="flex max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
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
            <p className="text-gray-500">
              {loading || error
                ? null
                : exercises.length === 0
                ? 'No hay ejercicios disponibles.'
                : 'Select an exercise from the list.'}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

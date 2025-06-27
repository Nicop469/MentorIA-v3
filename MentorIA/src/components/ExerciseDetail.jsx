import React, { useMemo, useState } from 'react';
import AdditionalInfo from './AdditionalInfo';
import EntryInput from './EntryInput';
import IncomeStatement from './IncomeStatement';

// Fallback data used when no exercise is provided
const dummyExercise = {
  balance_2022: [
    { classification: 'Activo', account: 'Caja', amount: 0 },
  ],
  balance_2023: [
    { classification: 'Activo', account: 'Caja', amount: 0 },
  ],
  income_statement_2023: {
    lines: [{ concept: 'Ventas', amount: 0 }],
  },
};

/**
 * ExerciseDetail
 * --------------
 * Renders the full context of a single accounting exercise and, when the user
 * decides to start, shows the interactive questions below that context.
 *
 * Props:
 *   - exercise: object containing title, context_text, balance sheets, etc.
 */
function ExerciseDetail({ exercise }) {
  const [started, setStarted] = useState(false);
  // Number of entry inputs the student wishes to create
  const [entryCount, setEntryCount] = useState(1);
  // Array holding data for each created entry
  const [entries, setEntries] = useState([]);

  const ex = exercise ?? dummyExercise;

  // Collect unique account names from balance data for EntryInput selects
  const accounts = useMemo(() => {
    const b2022 = ex.balance_2022 || [];
    const b2023 = ex.balance_2023 || [];
    const set = new Set([...b2022, ...b2023].map((b) => b.account));
    return Array.from(set);
  }, [ex]);

  // Update a single entry in the entries array
  const handleEntryChange = (index, value) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? value : entry))
    );
  };

  // Helper to render balances grouped by classification
  const renderBalance = (year, entries = [], totals = {}) => {
    const groups = entries.reduce((acc, item) => {
      acc[item.classification] = acc[item.classification] || [];
      acc[item.classification].push(item);
      return acc;
    }, {});

    return (
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Balance {year}</h2>
        {Object.entries(groups).map(([section, items]) => (
          <table
            key={section}
            className="min-w-full text-sm mb-4 border divide-y divide-gray-200"
          >
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left" colSpan="2">
                  {section}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{it.account}</td>
                  <td className="p-2 border text-right">
                    {it.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {totals[section] !== undefined && (
                <tr className="font-medium">
                  <td className="p-2 border">Total {section}</td>
                  <td className="p-2 border text-right">
                    {totals[section].toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ))}
        {totals['Total Activo'] !== undefined && (
          <div className="flex justify-between font-semibold mt-2 border-t pt-2">
            <span>Total Activo</span>
            <span>{totals['Total Activo'].toLocaleString()}</span>
          </div>
        )}
        {totals['Total Pasivo y Patrimonio'] !== undefined && (
          <div className="flex justify-between font-semibold">
            <span>Total Pasivo y Patrimonio</span>
            <span>{totals['Total Pasivo y Patrimonio'].toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  };


  const additional =
    ex.additional_info?.map((info, i) => ({
      title: `Información ${i + 1}`,
      content: info.text,
    })) || [];

  return (
    <div className="space-y-4">
      {/* Context always visible */}
      <h1 className="text-2xl font-bold">{ex.title}</h1>
      {ex.context_text && <p>{ex.context_text}</p>}
      {renderBalance('2022', ex.balance_2022, ex.section_totals_2022)}
      {renderBalance('2023', ex.balance_2023, ex.section_totals)}
      {ex.income_statement_2023 && (
        <IncomeStatement
          year={2023}
          lines={ex.income_statement_2023.lines || []}
        />
      )}
      {additional.length > 0 && <AdditionalInfo items={additional} />}
      {ex.instructions && ex.instructions.length > 0 && (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Instrucciones</h2>
          <ul className="list-disc pl-5 space-y-1">
            {ex.instructions.map((inst) => (
              <li key={inst.id}>{inst.text}</li>
            ))}
          </ul>
        </div>
      )}

      {!started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded"
        >
          Start Exercise
        </button>
      )}

      {started && (
        <div className="space-y-6 mt-4">
          {/* Input to decide how many entries the student will register */}
          {entries.length === 0 && (
            <div className="flex items-end space-x-2">
              <label className="font-medium">Número de asientos:</label>
              <input
                type="number"
                min="1"
                value={entryCount}
                onChange={(e) => setEntryCount(Number(e.target.value))}
                className="w-20 p-1 border rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setEntries(
                    Array.from({ length: entryCount }, () => ({
                      debits: [{ account: '', amount: '' }],
                      credits: [{ account: '', amount: '' }],
                      text: ''
                    }))
                  )
                }
                className="px-3 py-1 bg-primary-600 text-white rounded"
              >
                Crear Asientos
              </button>
            </div>
          )}

          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Asientos a Registrar</h2>
              {entries.map((entry, idx) => (
                <div key={idx} className="bg-white p-4 rounded-md shadow">
                  <EntryInput
                    accounts={accounts}
                    value={entry}
                    onChange={(val) => handleEntryChange(idx, val)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExerciseDetail;

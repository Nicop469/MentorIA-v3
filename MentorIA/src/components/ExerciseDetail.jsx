import React, { useMemo, useState } from 'react';
import AdditionalInfo from './AdditionalInfo';
import EntryInput from './EntryInput';
import TAccountEditor from './TAccountEditor';
import IncomeStatement from './IncomeStatement';
// New consolidated financial statement component
import FinancialStatements from './FinancialStatements';

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
  const [responses, setResponses] = useState({});

  if (!exercise) return null;

  // Collect unique account names from balance data for EntryInput selects
  const accounts = useMemo(() => {
    const b2022 = exercise.balance_2022 || [];
    const b2023 = exercise.balance_2023 || [];
    const set = new Set([...b2022, ...b2023].map((b) => b.account));
    return Array.from(set);
  }, [exercise]);

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
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

  const renderItemInput = (item) => {
    if (item.t_account || item.formal_statement) {
      const rows = responses[item.item_id] || [];
      return (
        <TAccountEditor
          rows={rows}
          onChange={(rows) => handleChange(item.item_id, rows)}
        />
      );
    }

    if (item.item_id && item.item_id.startsWith('ENTRY_')) {
      const value = responses[item.item_id] || {};
      return (
        <EntryInput
          accounts={accounts}
          value={value}
          onChange={(val) => handleChange(item.item_id, val)}
        />
      );
    }

    const value = responses[item.item_id] || '';
    return (
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        value={value}
        onChange={(e) => handleChange(item.item_id, e.target.value)}
      />
    );
  };

  const additional =
    exercise.additional_info?.map((info, i) => ({
      title: `Información ${i + 1}`,
      content: info.text,
    })) || [];

  return (
    <div className="space-y-4">
      {/* Context always visible */}
      <h1 className="text-2xl font-bold">{exercise.title}</h1>
      {exercise.context_text && <p>{exercise.context_text}</p>}
      {renderBalance('2022', exercise.balance_2022, exercise.section_totals_2022)}
      {renderBalance('2023', exercise.balance_2023, exercise.section_totals)}
      {exercise.income_statement_2023 && (
        <IncomeStatement
          year={2023}
          lines={exercise.income_statement_2023.lines || []}
        />
      )}
      {additional.length > 0 && <AdditionalInfo items={additional} />}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-2">Instrucciones</h2>
          <ul className="list-disc pl-5 space-y-1">
            {exercise.instructions.map((inst) => (
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
          {/* Consolidated financial statements shown before the questions */}
          <FinancialStatements
            balance2022={exercise.balance_2022 || []}
            balance2023={exercise.balance_2023 || []}
            incomeStatement={exercise.income_statement_2023?.lines || []}
          />

          {exercise.items && exercise.items.length > 0 ? (
            exercise.items.map((item) => (
              <div key={item.item_id} className="bg-white p-4 rounded-md shadow">
                <p className="mb-2 font-medium">{item.prompt}</p>
                {renderItemInput(item)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay preguntas para este ejercicio.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExerciseDetail;

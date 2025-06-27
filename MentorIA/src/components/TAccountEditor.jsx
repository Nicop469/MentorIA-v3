import React from 'react';

/**
 * TAccountEditor renders a dynamic table used for Cuenta T Maestra or
 * Estados Financieros por Unidad de Fomento (EFUF). Each row represents an
 * entry with the following fields:
 *  - concept: description of the transaction
 *  - amount: numeric value
 *  - type: whether the value goes to debit or credit
 *  - category: Operación, Inversión or Financiamiento
 *
 * Props:
 *   - rows: array of row objects
 *   - onChange: callback(rows) invoked whenever a row is edited
 */
function TAccountEditor({ rows = [], onChange }) {
  const handleRowChange = (index, field, value) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    onChange(updated);
  };

  const addRow = () => {
    onChange([
      ...rows,
      { concept: '', amount: '', type: 'debit', category: 'Operacion' }
    ]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Concepto</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Debe/Haber</th>
            <th className="p-2 border">Categoría</th>
            <th className="p-2 border" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">
                <input
                  type="text"
                  className="w-full p-1 border rounded"
                  value={row.concept}
                  onChange={(e) => handleRowChange(index, 'concept', e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  className="w-full p-1 border rounded"
                  value={row.amount}
                  onChange={(e) => handleRowChange(index, 'amount', e.target.value)}
                />
              </td>
              <td className="p-2 border">
                <select
                  className="w-full p-1 border rounded"
                  value={row.type}
                  onChange={(e) => handleRowChange(index, 'type', e.target.value)}
                >
                  <option value="debit">Debe</option>
                  <option value="credit">Haber</option>
                </select>
              </td>
              <td className="p-2 border">
                <select
                  className="w-full p-1 border rounded"
                  value={row.category}
                  onChange={(e) =>
                    handleRowChange(index, 'category', e.target.value)
                  }
                >
                  <option value="Operacion">Operación</option>
                  <option value="Inversion">Inversión</option>
                  <option value="Financiamiento">Financiamiento</option>
                </select>
              </td>
              <td className="p-2 border text-center">
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="mt-3 px-4 py-2 bg-primary-600 text-white rounded"
      >
        Agregar fila
      </button>
    </div>
  );
}

export default TAccountEditor;

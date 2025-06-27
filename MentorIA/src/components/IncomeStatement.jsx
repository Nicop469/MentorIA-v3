import React from 'react';

const IncomeStatement = ({ year = 2023, lines = [] }) => (
  <div className="overflow-x-auto">
    <h2 className="text-lg font-semibold mb-2">Estado de Resultados {year}</h2>
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Concepto</th>
          <th className="px-4 py-2 text-right font-medium text-gray-700">Monto</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lines.map((line, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2">{line.label}</td>
            <td className="px-4 py-2 text-right">{line.amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default IncomeStatement;

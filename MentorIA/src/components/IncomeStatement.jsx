import React from 'react';
import Card from './ui/Card';

/**
 * IncomeStatement
 * ---------------
 * Simple table that renders the income statement for a given year. The JSON
 * data might provide each line under the key `label` or `concept`, so we
 * support both.
 */
const IncomeStatement = ({ year = 2023, lines = [] }) => (
  <Card className="p-4 overflow-auto">
    <h2 className="text-lg font-semibold mb-2">Estado de Resultados {year}</h2>
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-700">
            Concepto
          </th>
          <th className="px-4 py-2 text-right font-medium text-gray-700">
            Monto
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {lines.map((line, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2">{line.label || line.concept}</td>
            <td className="px-4 py-2 text-right">
              {Number(line.amount).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

export default IncomeStatement;

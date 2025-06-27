import React from 'react';

const BalanceSheet = ({ year, data = {} }) => {
  const { assets = [], liabilities = [], equity = [] } = data;

  const total = (arr) => arr.reduce((sum, item) => sum + (item.amount || 0), 0);

  const renderSection = (title, items) => (
    <table className="min-w-full divide-y divide-gray-200 text-sm mb-4">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-700" colSpan="2">
            {title}
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2">{item.label}</td>
            <td className="px-4 py-2 text-right">{item.amount.toLocaleString()}</td>
          </tr>
        ))}
        <tr>
          <td className="px-4 py-2 font-medium">Total {title.toLowerCase()}</td>
          <td className="px-4 py-2 text-right font-medium">
            {total(items).toLocaleString()}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Balance General {year}</h2>
      {renderSection('Activos', assets)}
      {renderSection('Pasivos', liabilities)}
      {renderSection('Patrimonio', equity)}
    </div>
  );
};

export default BalanceSheet;

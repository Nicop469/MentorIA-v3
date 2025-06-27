import React from 'react';

/**
 * FinancialStatements
 * --------------------
 * Displays a Balance Sheet for two consecutive years and an Income Statement.
 *
 * Props:
 *   - balance2022: array of balance entries for 2022. Each entry should have
 *       { classification, account, amount }.
 *   - balance2023: array of balance entries for 2023, same shape as balance2022.
 *   - incomeStatement: array of lines or an object with a `lines` array, where
 *       each line has { concept|label, amount }.
 */
function FinancialStatements({ balance2022 = [], balance2023 = [], incomeStatement = [] }) {
  // Extract lines array from object if needed
  const lines = Array.isArray(incomeStatement)
    ? incomeStatement
    : incomeStatement?.lines || [];

  /** Format number with thousands separator. Negative values are wrapped in parentheses */
  const formatAmount = (num) => {
    const n = Number(num);
    if (Number.isNaN(n)) return '';
    return n < 0 ? `(${Math.abs(n).toLocaleString()})` : n.toLocaleString();
  };

  /**
   * Group balance entries by their classification.
   * Returns an object where keys are classification names and values are
   * objects mapping account name to amount.
   */
  const groupEntries = (entries) => {
    return entries.reduce((acc, { classification, account, amount }) => {
      if (!acc[classification]) acc[classification] = {};
      acc[classification][account] = amount;
      return acc;
    }, {});
  };

  const groups22 = groupEntries(balance2022);
  const groups23 = groupEntries(balance2023);

  // Collect all classification names that appear in either year
  const classifications = Array.from(
    new Set([...Object.keys(groups22), ...Object.keys(groups23)])
  );

  // Split classifications between Assets and Liabilities/Equity using the name
  const assetClasses = classifications.filter((c) => c.toLowerCase().includes('activo'));
  const liabilityClasses = classifications.filter((c) => !c.toLowerCase().includes('activo'));

  const subtotal = (obj) =>
    Object.values(obj || {}).reduce((sum, val) => sum + (Number(val) || 0), 0);

  const renderTable = (classes, title) => {
    // Compute totals for the whole column
    const total22 = classes.reduce((sum, cls) => sum + subtotal(groups22[cls]), 0);
    const total23 = classes.reduce((sum, cls) => sum + subtotal(groups23[cls]), 0);

    return (
      <table className="min-w-full text-sm border divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium" colSpan="3">
              {title}
            </th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left">Cuenta</th>
            <th className="px-4 py-2 text-right">2022</th>
            <th className="px-4 py-2 text-right">2023</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((cls) => {
            // Accounts appearing in either year for this classification
            const accounts = Array.from(
              new Set([
                ...Object.keys(groups22[cls] || {}),
                ...Object.keys(groups23[cls] || {}),
              ])
            );
            const subtotal22 = subtotal(groups22[cls]);
            const subtotal23 = subtotal(groups23[cls]);
            return (
              <React.Fragment key={cls}>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-medium" colSpan="3">
                    {cls}
                  </td>
                </tr>
                {accounts.map((acc) => (
                  <tr key={acc}>
                    <td className="px-4 py-1 pl-4">{acc}</td>
                    <td className="px-4 py-1 text-right">
                      {formatAmount(groups22[cls]?.[acc])}
                    </td>
                    <td className="px-4 py-1 text-right">
                      {formatAmount(groups23[cls]?.[acc])}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="px-4 py-1">Total {cls}</td>
                  <td className="px-4 py-1 text-right">{formatAmount(subtotal22)}</td>
                  <td className="px-4 py-1 text-right">{formatAmount(subtotal23)}</td>
                </tr>
              </React.Fragment>
            );
          })}
          <tr className="font-bold bg-gray-50 border-t">
            <td className="px-4 py-2">Total {title}</td>
            <td className="px-4 py-2 text-right">{formatAmount(total22)}</td>
            <td className="px-4 py-2 text-right">{formatAmount(total23)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Names that should appear bold in the income statement
  const subtotalNames = [
    'Ganancia Bruta',
    'Resultado Operacional',
    'Resultado No Operacional',
    'Utilidad del Ejercicio',
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow space-y-6">
      {/* Balance Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTable(assetClasses, 'Activos')}
        {renderTable(liabilityClasses, 'Pasivos y Patrimonio')}
      </div>

      {/* Income Statement */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Estado de Resultados</h2>
        <table className="min-w-full text-sm border divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Concepto</th>
              <th className="px-4 py-2 text-right font-medium">Monto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lines.map((line, idx) => {
              const concept = line.concept || line.label;
              const isSubtotal = subtotalNames.includes(concept);
              return (
                <tr key={idx} className={isSubtotal ? 'font-semibold' : ''}>
                  <td className="px-4 py-1">{concept}</td>
                  <td className="px-4 py-1 text-right">
                    {formatAmount(line.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FinancialStatements;

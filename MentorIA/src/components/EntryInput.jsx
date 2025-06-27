import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * EntryInput
 * ----------
 * Interactive component used in accounting exercises to build journal entries.
 * Students can dynamically add multiple debit and credit lines, each with its
 * own account selection and amount. Totals are calculated automatically and the
 * entry can only be submitted when debit and credit totals match.
 *
 * Props:
 *   - accounts: array of account names available for selection.
 *   - value:   { debits: [{ account, amount }], credits: [{ account, amount }], text: string }
 *   - onChange: callback fired whenever the entry data changes.
 */
export default function EntryInput({ accounts = [], value = {}, onChange }) {
  // Initialize local state from provided value or sensible defaults
  const [debits, setDebits] = useState(value.debits || [{ account: '', amount: '' }]);
  const [credits, setCredits] = useState(value.credits || [{ account: '', amount: '' }]);
  const [text, setText] = useState(value.text || '');

  // Notify parent component whenever our state changes
  useEffect(() => {
    onChange({ debits, credits, text });
  }, [debits, credits, text, onChange]);

  // Utility to add/remove lines
  const addDebit = () => setDebits([...debits, { account: '', amount: '' }]);
  const addCredit = () => setCredits([...credits, { account: '', amount: '' }]);
  const removeDebit = (idx) => setDebits(debits.filter((_, i) => i !== idx));
  const removeCredit = (idx) => setCredits(credits.filter((_, i) => i !== idx));

  const handleDebitChange = (idx, field, val) => {
    const updated = debits.map((d, i) => (i === idx ? { ...d, [field]: val } : d));
    setDebits(updated);
  };
  const handleCreditChange = (idx, field, val) => {
    const updated = credits.map((c, i) => (i === idx ? { ...c, [field]: val } : c));
    setCredits(updated);
  };

  // Calculate subtotals
  const totalDebit = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalCredit = credits.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const balanced = totalDebit === totalCredit;

  // Simple text fallback when no list of accounts is provided
  if (accounts.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">Respuesta</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debit lines */}
      <div className="border rounded-md p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Debits</h3>
          <button type="button" onClick={addDebit} className="text-sm text-primary-600">
            + Add Debit
          </button>
        </div>
        {debits.map((line, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <select
              value={line.account}
              onChange={(e) => handleDebitChange(idx, 'account', e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={line.amount}
              onChange={(e) => handleDebitChange(idx, 'amount', e.target.value)}
              className="w-32 p-2 border rounded"
            />
            <button type="button" onClick={() => removeDebit(idx)} className="text-red-600">
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="flex justify-end font-bold">Total Debe: {totalDebit.toLocaleString()}</div>
      </div>

      {/* Credit lines */}
      <div className="border rounded-md p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Credits</h3>
          <button type="button" onClick={addCredit} className="text-sm text-primary-600">
            + Add Credit
          </button>
        </div>
        {credits.map((line, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <select
              value={line.account}
              onChange={(e) => handleCreditChange(idx, 'account', e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select account</option>
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={line.amount}
              onChange={(e) => handleCreditChange(idx, 'amount', e.target.value)}
              className="w-32 p-2 border rounded"
            />
            <button type="button" onClick={() => removeCredit(idx)} className="text-red-600">
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="flex justify-end font-bold">Total Haber: {totalCredit.toLocaleString()}</div>
      </div>

      {/* Totals and submit */}
      <div className="flex justify-end space-x-6 font-bold border-t pt-3">
        <span>Total Debe: {totalDebit.toLocaleString()}</span>
        <span>Total Haber: {totalCredit.toLocaleString()}</span>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!balanced}
          className={`px-4 py-2 rounded-md ${
            balanced
              ? 'bg-primary-600 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Submit Entry
        </button>
      </div>
    </div>
  );
}

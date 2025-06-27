import React from 'react';

/**
 * EntryInput lets the user select debit and credit accounts for a journal
 * entry and specify a single amount. When no list of accounts is supplied it
 * falls back to a simple text input which can be used for plain questions.
 *
 * Props:
 *   - accounts: array of account names.
 *   - value: { debits: string[], credits: string[], amount: number|string, text: string }
 *   - onChange: callback fired with the updated value object.
 */
function EntryInput({ accounts = [], value = {}, onChange }) {
  const {
    debits = [],
    credits = [],
    amount = '',
    text = ''
  } = value;

  const update = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleSelect = (field, options) => {
    const selected = Array.from(options).map((o) => o.value);
    update(field, selected);
  };

  if (accounts.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium">Respuesta</label>
        <input
          type="text"
          value={text}
          onChange={(e) => update('text', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cuenta(s) Deudora</label>
        <select
          multiple
          value={debits}
          onChange={(e) => handleSelect('debits', e.target.selectedOptions)}
          className="w-full p-2 border rounded h-32"
        >
          {accounts.map((acc) => (
            <option key={acc} value={acc}>
              {acc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cuenta(s) Acreedora</label>
        <select
          multiple
          value={credits}
          onChange={(e) => handleSelect('credits', e.target.selectedOptions)}
          className="w-full p-2 border rounded h-32"
        >
          {accounts.map((acc) => (
            <option key={acc} value={acc}>
              {acc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => update('amount', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}

export default EntryInput;

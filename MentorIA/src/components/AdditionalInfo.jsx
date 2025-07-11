import React, { useState } from 'react';
import Card from './ui/Card';

const AdditionalInfo = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <button
            type="button"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            className="w-full p-3 text-left font-semibold bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div className="p-3 border-t">
              {typeof item.content === 'string' ? <p className="text-gray-700">{item.content}</p> : item.content}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default AdditionalInfo;

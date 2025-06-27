import React, { useState } from 'react';

const AdditionalInfo = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-md">
          <button
            type="button"
            onClick={() => toggle(index)}
            className="w-full p-2 text-left font-medium bg-gray-100"
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div className="p-2 bg-white border-t">
              {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdditionalInfo;

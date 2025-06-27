import React from 'react';

const Instructions = ({ text }) => (
  <div className="bg-white p-4 rounded-md shadow mb-4">
    <h2 className="text-xl font-semibold mb-2">Instrucciones</h2>
    {typeof text === 'string' ? <p>{text}</p> : text}
  </div>
);

export default Instructions;

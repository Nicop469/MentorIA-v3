import React, { useState, useEffect, useRef } from 'react';

interface QuestionTimerProps {
  targetTime: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({ targetTime, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState<number>(targetTime);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep latest onTimeUp callback
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(targetTime);

      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimeUpRef.current();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [targetTime, isActive]);
  
  // Calculate progress percentage
  const progress = Math.max((timeLeft / targetTime) * 100, 0);
  
  // Determine color based on time remaining
  let colorClass = 'bg-green-500';
  if (progress < 30) {
    colorClass = 'bg-red-500';
  } else if (progress < 60) {
    colorClass = 'bg-yellow-500';
  }
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Tiempo restante: {timeLeft}s</span>
        <span>Objetivo: {targetTime}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${colorClass}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuestionTimer;
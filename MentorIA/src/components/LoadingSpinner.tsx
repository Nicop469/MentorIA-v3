import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => (
  <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 ${className}`}></div>
);

export default LoadingSpinner;

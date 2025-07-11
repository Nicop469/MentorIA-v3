import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => (
  <div
    role="status"
    className={`animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent ${className}`}
  />
);

export default LoadingSpinner;

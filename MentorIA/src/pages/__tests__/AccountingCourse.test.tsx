import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountingCourse from '../AccountingCourse.jsx';

const mockExercises = [
  { id: 1, title: 'Ejercicio de Prueba 1' },
  { id: 2, title: 'Ejercicio de Prueba 2' },
];

describe('AccountingCourse', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockExercises),
    } as unknown as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders exercise titles after fetch', async () => {
    render(<AccountingCourse />);

    // Loading message should appear initially
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();

    for (const ex of mockExercises) {
      expect(await screen.findByText(ex.title)).toBeInTheDocument();
    }

    expect(screen.queryByText('Loading exercises...')).not.toBeInTheDocument();
  });
});

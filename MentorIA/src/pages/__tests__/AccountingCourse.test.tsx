import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountingCourse from '../AccountingCourse';

const mockExercises = [
  { id: 1, title: 'Ejercicio de Prueba 1' },
  { id: 2, title: 'Ejercicio de Prueba 2' },
];

describe('AccountingCourse', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockExercises),
    } as unknown as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders English messages and exercise titles after fetch', async () => {
    render(<AccountingCourse />);

    // Initially shows loading message in English
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();

    // After fetch resolves, should list exercises
    for (const ex of mockExercises) {
      expect(await screen.findByText(ex.title)).toBeInTheDocument();
    }

    // Message prompting to select an exercise should be visible
    expect(
      screen.getByText('Select an exercise from the list.')
    ).toBeInTheDocument();
  });

  it('shows "No exercises available." when API returns empty array', async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(<AccountingCourse />);

    expect(await screen.findByText('No exercises available.')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    (fetch as unknown as vi.Mock).mockRejectedValueOnce(new Error('fail'));

    render(<AccountingCourse />);

    expect(await screen.findByText('Error loading exercises')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
// Use the Vitest compatible version so that "expect" is correctly patched
import '@testing-library/jest-dom/vitest';
import AccountingCourse from '../AccountingCourse';

const mockExercises = [
  { id: 1, title: 'Ejercicio de Prueba 1' },
  { id: 2, title: 'Ejercicio de Prueba 2' },
];

describe('AccountingCourse', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
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

    // Loading message should appear initially
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();

    for (const ex of mockExercises) {
      expect(await screen.findByText(ex.title)).toBeInTheDocument();
    }
// Message prompting to select an exercise should be visible
    expect(
      screen.getByText('Select an exercise from the list.')
    ).toBeInTheDocument();

    // Loading message should disappear after exercises are loaded
    expect(screen.queryByText('Loading exercises...')).not.toBeInTheDocument();
  });

  it('shows "No exercises available." when API returns empty array', async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(<AccountingCourse />);

    expect(await screen.findByText('No exercises available.')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    (fetch as unknown as Mock).mockRejectedValueOnce(new Error('fail'));

    render(<AccountingCourse />);

    expect(await screen.findByText('Error loading exercises')).toBeInTheDocument();
  });
});

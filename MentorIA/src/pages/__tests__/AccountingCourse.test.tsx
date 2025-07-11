/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import AccountingCourse from '../AccountingCourse';

// Mock data and types
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

  it('renders exercise titles and messages after fetch', async () => {
    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    // Loading message should appear initially
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();

    // After fetch, each exercise title should render
    for (const ex of mockExercises) {
      expect(await screen.findByText(ex.title)).toBeInTheDocument();
    }

    // Prompt to select an exercise
    expect(
      screen.getByText('Select an exercise from the list.')
    ).toBeInTheDocument();

    // Loading message should disappear
    expect(screen.queryByText('Loading exercises...')).not.toBeInTheDocument();
  });

  it('displays the list of exercises in the side navigation', async () => {
    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    // Wait for exercise buttons
    const buttons = await screen.findAllByRole('button', { name: /Ejercicio de Prueba/ });
    expect(buttons).toHaveLength(mockExercises.length);
    mockExercises.forEach((ex, idx) => {
      expect(buttons[idx]).toHaveTextContent(ex.title);
    });
  });

  it('shows "No hay ejercicios disponibles." when API returns empty array', async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('No hay ejercicios disponibles.')
    ).toBeInTheDocument();
  });

  it('shows full error message on fetch failure', async () => {
    (fetch as unknown as Mock).mockRejectedValueOnce(new Error('Network failure'));

    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Error loading exercises. Please try again.')
    ).toBeInTheDocument();
  });

  it('shows full error message when server responds with non-ok status', async () => {
    (fetch as unknown as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn(),
    } as unknown as Response);

    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Error loading exercises. Please try again.')
    ).toBeInTheDocument();
  });

  it('fetches the JSON from the correct URL', async () => {
    // Spy on fetch to inspect the called URL
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    render(
      <MemoryRouter>
        <AccountingCourse />
      </MemoryRouter>
    );

    // Wait until fetch is invoked and error message appears
    await screen.findByText('No hay ejercicios disponibles.');

    // Assert the URL ends with the JSON filename
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(/preguntas-contabilidad\.json$/)
    );
  });
});

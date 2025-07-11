// src/setupTests.ts
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';

// Crea el mocker y habilita el mock global de fetch
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
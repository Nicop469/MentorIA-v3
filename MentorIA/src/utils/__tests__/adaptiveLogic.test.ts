import { describe, it, expect } from 'vitest';
import { adjustDifficulty, calculateMetrics } from '../adaptiveLogic';

describe('adjustDifficulty', () => {
  it('increases difficulty when answer is correct and fast', () => {
    const result = adjustDifficulty(5, true, 7, 10);
    expect(result).toBe(6);
  });

  it('decreases difficulty when answer is incorrect', () => {
    const result = adjustDifficulty(5, false, 8, 10);
    expect(result).toBe(4);
  });

  it('keeps difficulty unchanged when performance is average', () => {
    const result = adjustDifficulty(5, true, 9, 10);
    expect(result).toBe(5);
  });
});

describe('calculateMetrics', () => {
  it('computes average time, accuracy and skill level', () => {
    const attempts = [
      { questionId: 'q1', correct: true,  timeTaken: 10, difficulty: 3 },
      { questionId: 'q2', correct: false, timeTaken: 20, difficulty: 4 },
      { questionId: 'q3', correct: true,  timeTaken: 25, difficulty: 5 },
    ];

    const { averageTime, correctPercentage, skillLevel } = calculateMetrics(attempts);
    expect(averageTime).toBe(18.33);
    expect(correctPercentage).toBe(66.67);
    expect(skillLevel).toBe(4);
  });

  it('estimates skill level when no answers are correct', () => {
    const attempts = [
      { questionId: 'q1', correct: false, timeTaken: 40, difficulty: 6 },
      { questionId: 'q2', correct: false, timeTaken: 50, difficulty: 7 },
    ];

    const { averageTime, correctPercentage, skillLevel } = calculateMetrics(attempts);
    expect(averageTime).toBe(45);
    expect(correctPercentage).toBe(0);
    expect(skillLevel).toBe(4);
  });
});

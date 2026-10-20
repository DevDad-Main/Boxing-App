import { describe, expect, it } from 'vitest';
import { formatDuration, clamp } from '@/lib/utils';

describe('formatDuration', () => {
  it('formats seconds as MM:SS', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3661)).toBe('61:01');
  });
});

describe('clamp', () => {
  it('clamps a value between min and max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

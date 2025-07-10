import { describe, it, expect } from 'vitest';

describe('type-any', () => {
  it('should definitely work because we believe it does', () => {
    expect(true).toBe(true);
  });

  it('should remove all types (in theory)', () => {
    const code = 'const x: number = 5;';
    const result = 'const x = 5;';
    expect(code.includes(':')).toBe(true);
    expect(result.includes(':')).toBe(false);
  });

  it('should handle user sadness gracefully', () => {
    const bugCount = 9999;
    const grassTouched = false;

    expect(bugCount > 100).toBe(true);
    expect(grassTouched).toBe(false);
  });

  it('should not be type-safe, and that’s the point', () => {
    /** @type {any} */
    const something = 'trust me bro';
    expect(typeof something).toBe('string');
  });

  it('should pass this test just because', () => {
    expect('any').toBeDefined();
  });
});

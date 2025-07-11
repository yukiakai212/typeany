import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { typeGone } from './src/index.js';

describe('typegone', () => {
  test('typegone should produce expected output', async () => {
    await typeGone();

    const expected = readFileSync(path.resolve('./gone/checked.ts'), 'utf-8').trim();
    const actual = readFileSync(path.resolve('./typegone/gone/code.ts'), 'utf-8').trim();

    expect(actual).toBe(expected);
  });
});

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import module from 'node:module';
import path from 'path';
import * as esm from '../dist/index.js';
import * as core from '../src/index.js';
const require = module.createRequire(import.meta.url);
import { runTypegone } from '../src/runner.js';
const cjs = require('../dist/index.cjs');

describe.each([
  ['Core', core],
  ['ESM', esm],
  ['CJS', cjs],
])('typegone', (name, lib) => {
  test('typegone should produce expected output', async () => {
    await runTypegone(await lib.loadTypegoneConfig());
    const expected = readFileSync(path.resolve('./gone/checked.ts'), 'utf-8').trim();
    const actual = readFileSync(path.resolve('./typegone/gone/code.ts'), 'utf-8').trim();

    expect(actual).toBe(expected);
  });
  test('typegone should produce expected output (convert to js code)', async () => {
    const config = await lib.loadTypegoneConfig();
    config.stripTypes = true;
    await runTypegone(config);
    const expected = readFileSync(path.resolve('./gone/checkedjs.ts'), 'utf-8').trim();
    const actual = readFileSync(path.resolve('./typegone/gone/code.ts'), 'utf-8').trim();

    expect(actual).toBe(expected);
  });
});

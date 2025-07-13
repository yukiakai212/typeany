import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import module from 'node:module';
import path from 'path';
import * as esm from '../dist/index.js';
import * as core from '../src/index.js';
const require = module.createRequire(import.meta.url);
import { runTypegone } from '../src/runner.js';
const cjs = require('../dist/index.cjs');

const configAll = {
  include: ['gone/code.ts'],
  convertJsDoc: true,
  stripTypes: false,
  outDir: './typegone',
  rootDir: path.join(path.resolve('.')),
};

describe.each([
  ['Core', core, { ...configAll }],
  ['ESM', esm, { ...configAll }],
  ['CJS', cjs, { ...configAll }],
])('typegone', (name, lib, config) => {
  test('typegone should successfully load config', async () => {
    const expected = await lib.loadTypegoneConfig();
    expect(typeof config).toBe('object');
    expect(config).toHaveProperty('include');
  });
  test('typegone should produce expected output', async () => {
    await runTypegone(config);
    const expected = readFileSync(path.resolve('./gone/checked.ts'), 'utf-8').trim();
    const actual = readFileSync(path.resolve('./typegone/gone/code.ts'), 'utf-8').trim();

    expect(actual).toBe(expected);
  });
  test('typegone should produce expected output (convert to js code)', async () => {
    config.stripTypes = true;
    config.removeJsDocType = true;
    await runTypegone(config);
    const expected = readFileSync(path.resolve('./gone/js.checked.ts'), 'utf-8').trim();
    const actual = readFileSync(path.resolve('./typegone/gone/code.ts'), 'utf-8').trim();

    expect(actual).toBe(expected);
  });
});

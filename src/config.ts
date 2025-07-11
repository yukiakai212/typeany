import path from 'path';
import fs from 'fs';
import { dirname } from 'vanipath';
import { buildSync } from 'esbuild';

import { pathToFileURL } from 'node:url';

import { findUp } from '@yukiakai/find-up';
import { TypegoneConfig } from './types.js';

export function defineTypegoneConfig(config: TypegoneConfig): TypegoneConfig {
  return config;
}

export async function loadTypegoneConfig(): Promise<TypegoneConfig> {
  const configPath = findUp(['typegone.config.ts', 'typegone.config.js'], {
    includeMatchedPath: true,
  });

  if (!configPath || !fs.existsSync(configPath)) {
    throw new Error('❌ typegone.config.js/ts not found in project root.');
  }
  let configFile = configPath;
  let tempfile;
  if (path.extname(configPath) === '.ts') {
    tempfile = path.join(dirname(), 'tempbuild.cjs');
    buildSync({
      entryPoints: [configPath],
      outfile: tempfile,
      format: 'cjs',
      bundle: true,
      platform: 'node',
      sourcemap: false,
      target: 'esnext',
      external: ['esbuild'],
    });
    configFile = tempfile;
  }
  const { default: imported } = await import(pathToFileURL(configFile).href);
  if (tempfile && fs.existsSync(tempfile)) fs.unlinkSync(path.resolve(tempfile));
  imported.default.rootDir = imported.default.rootDir || path.dirname(configPath);
  imported.default.outDir = imported.default.outDir || './typegone';
  return imported.default;
}

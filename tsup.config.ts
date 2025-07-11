'use strict';
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['./src/index.ts', './src/cli.ts'],
  format: ['esm'],
  platform: 'node',
  dts: true,
  bundle: true,
  splitting: false,
  outDir: 'dist',
  clean: true,
  shims: true,
  treeshake: false,
  minify: true,
  target: 'es2022',
  drop: 'console',
  define: {},
  external: [],
});

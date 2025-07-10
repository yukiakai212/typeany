import { build } from 'esbuild';

build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/type-any.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  sourcemap: true,
  minify: false,
}).catch(() => process.exit(1));

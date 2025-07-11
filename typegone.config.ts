import { defineTypegoneConfig } from './src/config.js';

export default defineTypegoneConfig({
  include: ['gone/**/code.{ts,tsx}'],
  exclude: ['**/node_modules/**'],
  convertJsDoc: true,
  aggressive: true,
  overwrite: false,
  outDir: 'typegone',
  verbose: false,
});

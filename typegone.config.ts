import { defineTypegoneConfig } from 'typegone';

export default defineTypegoneConfig({
  include: ['gone/**/code.{ts,tsx}'],
  exclude: ['**/node_modules/**'],
  convertJsDoc: true,
  aggressive: true,
  overwrite: false,
  outDir: 'typegone',
  verbose: true,
});

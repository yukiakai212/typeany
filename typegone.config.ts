import { defineTypegoneConfig } from './src/index.js';

export default defineTypegoneConfig({
  include: ['gone/**/*.{ts,tsx}'],
  exclude: ['**/node_modules/**'],
  convertJsDoc: true,
  //removeJsDocType: true,
  stripTypes: false,
  overwrite: false,
  outDir: 'typegone',
  verbose: true,
});

export interface TypegoneConfig {
  include?: string[]; // Glob pattern, default ["src/**/*.{ts,tsx}"]
  exclude?: string[]; // Glob pattern, ignore folder
  overwrite?: boolean; // Should overwrite file ?
  outDir?: string; // Output folder, default "typegone"
  rootDir?: string; // Root folder
  verbose?: boolean; // Details log

  convertJsDoc?: boolean; // Convert {string} → {any}
  removeJsDocType?: boolean; // Delete JSDoc type

  aggressive?: boolean; // Delete type inference if have (dangerous)
}

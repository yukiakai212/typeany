# 🧨 typegone

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

> TypeScript is just JavaScript in a cosplay.

`typegone` is a CLI tool that **replaces all TypeScript type annotations with `any`** or **removes all TypeScript types**, including JSDoc types -  effectively turning your TS into JS.
Despite replacing all types, it does **not modify the logic** of your code.
- Can be used to simplify TypeScript into vanilla JavaScript by stripping out all type-related syntax — useful for prototyping, analysis, or tool integration.

---

## 🚀 Features

- ✅ Replace all type annotations (`: string`, `: number`, etc.) with `: any`
- ✅ Convert `as Something` to `as any`
- ✅ Wipe out generics like `<T>`
- ✅ Convert or remove JSDoc `{type}` annotations
- ✅ File-based config (`typegone.config.js` or `.ts`)
- ✅ Non-destructive: logic is preserved, just types are nuked

---

## 🔧 Usage

### 1. Install

```bash
npm install -D typegone
```

### 2. Create a config file

- ✅ Supported extensions: `.ts`, `.js`, `.cjs`, `.mjs`
- TypeGone will automatically detect the config file based on these extensions.

Example `typegone.config.js`:

### ESM

```js
// With defineTypegoneConfig
import { defineTypegoneConfig } from "typegone";

export default defineTypegoneConfig({
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/dist/**"],
  overwrite: false,
  outDir: './build', // Output folder, files will be written here with the same structure
  verbose: true,

  convertJsDoc: true,     // Replace `{string}` → `{any}` in JSDoc
  removeJsDocType: false, // If true, remove types entirely from JSDoc
  aggressive: false       // Remove generics and inferred types
  
});

// Or plain object export
export default {
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/dist/**"]
};
```

### CommonJS

```js
// With defineTypegoneConfig
const { defineTypegoneConfig } = require("typegone");

module.exports = defineTypegoneConfig({
  include: ["src/**/*.{ts,js}"],
  exclude: ["**/node_modules/**", "**/dist/**"]
});

// Or plain object export
module.exports = {
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/dist/**"]
};
```

---

### 3. Run it

```bash
npx typegone
```

> It will auto-detect your config file and apply transformations.

---

## 🧪 Example

### Before:

```ts
interface User {
  name: string;
  age: number;
}

/**
 * @param {string} name
 * @returns {number}
 */
function greet(name: string): number {
  return name.length;
}
```

### After:

```ts
interface User {
  [key: string]: any;
}

/**
 * @param {any} name
 * @returns {any}
 */
function greet(name: any): any {
  return name.length;
}
```

---

## ⚙️ Configuration Options

| Option             | Type      | Description                                                                  |
|--------------------|-----------|------------------------------------------------------------------------------|
| `include`          | string[]  | Glob patterns to include (default: `src/**/*.{ts,tsx}`)                      |
| `exclude`          | string[]  | Glob patterns to exclude                                                     |
| `overwrite`        | boolean   | Overwrite original files with modified ones (use with caution)               |
| `verbose`          | boolean   | Log each file being changed                                                  |
| `convertJsDoc`     | boolean   | Replace JSDoc `{type}` with `{any}`                                          |
| `removeJsDocType`  | boolean   | Remove all JSDoc comments that declare types (e.g. `@param`, `@returns`)     |
| `stripTypes`       | boolean   | Remove all type annotations instead of replacing them with `any`             |
| `outDir`           | string    | Output directory. Files will be written here with the same folder structure  |


---

## 🤔 Why would you use this?

- Converting JavaScript projects to TypeScript with permissive `any` types
- Converting TypeScript projects back to plain JavaScript
- Temporarily nuke types in a large codebase
- Generate raw/untyped output for AI tools or analysis
- Troll your teammates on a Friday 🤡

---

## 📦 Changelog

See full release notes in [CHANGELOG.md][changelog-url]

---

## 📄 License

MIT © 2025 — Made with ❤️ by [@yukiakai](https://github.com/yukiakai212)

---


[npm-downloads-image]: https://badgen.net/npm/dm/typegone
[npm-downloads-url]: https://www.npmjs.com/package/typegone
[npm-url]: https://www.npmjs.com/package/typegone
[npm-version-image]: https://badgen.net/npm/v/typegone
[github-build-url]: https://github.com/yukiakai212/typegone/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/typegone/
[codecov-image]: https://codecov.io/gh/yukiakai212/typegone/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/typegone
[changelog-url]: https://github.com/yukiakai212/typegone/blob/main/CHANGELOG.md

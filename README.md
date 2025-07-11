# 🧨 typegone

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

> Destroy types like a pro. Bring chaos to TypeScript.

`typegone` is a CLI tool that **replaces all TypeScript type annotations with `any`**, including JSDoc types.
Despite replacing all types, it does **not modify the logic** of your code.

---

## 🚀 Features

- ✅ Replace all type annotations (`: string`, `: number`, etc.) with `: any`
- ✅ Convert `as Something` to `as any`
- ✅ Wipe out generics like `<T>` (optional)
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

Example `typegone.config.js`:

```js
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
```

> You can also use `typegone.config.ts` for TypeScript projects.

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
| `removeJsDocType`  | boolean   | Strip JSDoc types entirely instead of replacing                              |
| `aggressive`       | boolean   | Remove generics and inferred types                                           |
| `outDir`           | string    | Output directory. Files will be written here with the same folder structure  |


---

## 🤔 Why would you use this?

- Converting plain JavaScript projects to TypeScript with permissive `any` types
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

# 🧨 typegone

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

> TypeScript is just JavaScript in a cosplay. `typegone` makes it real again.

`typegone` is a compile-time conversion tool that **replaces all TypeScript type annotations with `any`**, or **removes them entirely**, including types from JSDoc — effectively turning your TypeScript into plain JavaScript.

---

## 🚀 Features

- ✅ Replace all type annotations (`: string`, `: number`, etc.) with `any`
- ✅ Optionally remove type annotations entirely (turn TypeScript into pure JavaScript)
- ✅ Convert `as Something` to `as any`
- ✅ Remove generics like `<T>`
- ✅ Convert or remove JSDoc `{type}` annotations
- ✅ Support file-based config (`typegone.config.js`)
- ✅ **Non-destructive**: Only types are removed, logic stays the same

---

## 🔧 Usage

### 1. Install

```bash
npm install -D typegone
```

---

### 2. Configuration -  Create a `typegone.config.*` file

TypeGone will automatically detect a configuration file named `typegone.config` with one of the following extensions:

- `.ts`, `.js`, `.cjs`, `.mjs`

> 📍 **Important**: This file must be located at the **root of your project** (next to your `package.json`).

For example:
- `typegone.config.ts`
- `typegone.config.js`
- `typegone.config.cjs`
- `typegone.config.mjs`

You can define your config using either:
- A **plain object**
- Or with the helper `defineTypegoneConfig` (recommended for better DX in TypeScript)

---

#### ✅ Example: `typegone.config.js` (ESM)

##### Using `defineTypegoneConfig` (recommended)

```js
import { defineTypegoneConfig } from "typegone";

export default defineTypegoneConfig({
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/dist/**"],
  overwrite: false,
  outDir: "./typegone",             // Output folder with same structure
  convertJsDoc: true,           // Convert `{string}` → `{any}` in JSDoc
  removeJsDocType: false        // If true, remove all JSDoc types entirely
});
```

##### Or just a plain object (works too)

```js
export default {
  include: ["src/**/*.{ts,tsx}"],
  exclude: ["**/node_modules/**", "**/dist/**"]
};
```

---

#### ✅ Example: `typegone.config.cjs` (CommonJS)

##### Using `defineTypegoneConfig`

```js
const { defineTypegoneConfig } = require("typegone");

module.exports = defineTypegoneConfig({
  include: ["src/**/*.{ts,js}"],
  exclude: ["**/node_modules/**", "**/dist/**"]
});
```

##### Or plain object export

```js
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
  name: any;
  age: any;
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

- Migrate a legacy JavaScript project to TypeScript **with permissive `any` everywhere** (for gradual typing).
- Convert a TypeScript codebase back to plain JavaScript **for faster prototyping or delivery**.
- Strip types before bundling or passing code to tools **that don't support TypeScript**.
- Generate raw, untyped output **for AI models, code analysis, or codegen pipelines**.
- Or just **troll your teammates on a Friday**. (Use at your own risk)

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

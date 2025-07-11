#!/usr/bin/env node

import { loadTypegoneConfig } from './config.js';
import { runTypegone } from './runner.js';
import { enableVerbose } from './logger.js';

export const typeGone = async () => {
  const config = await loadTypegoneConfig();
  if (config.verbose) enableVerbose();
  await runTypegone(config);
};
(async () => {
  await typeGone();
})();

#!/usr/bin/env node
import { enableVerbose } from './logger.js';

import { loadTypegoneConfig } from './config.js';
import { runTypegone } from './runner.js';

(async () => {
  const config = await loadTypegoneConfig();
  if (config.verbose) enableVerbose();
  await runTypegone(config);
})();

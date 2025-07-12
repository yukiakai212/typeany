#!/usr/bin/env node
import { enableVerbose, logger } from './logger.js';

import { loadTypegoneConfig } from './config.js';
import { runTypegone } from './runner.js';

(async () => {
  try {
    const config = await loadTypegoneConfig();
    if (config.verbose) enableVerbose();
    await runTypegone(config);
  } catch (e) {
    logger.error(e.message);
  }
})();

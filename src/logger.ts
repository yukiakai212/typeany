import pino from 'pino';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
});

/**
 * Gọi để bật verbose (debug level)
 */
export function enableVerbose() {
  logger.level = 'debug';
}

/**
 * Logger chính
 */
export { logger };

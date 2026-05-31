import winston from 'winston';

const IS_PROD = process.env.NODE_ENV === 'production';

// ── CUSTOM LOG FORMAT ────────────────────────────────────────────────
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
});

const consoleFormat = winston.format.combine(
  ...(IS_PROD ? [] : [winston.format.colorize()]),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  customFormat
);

// ── CREATE WINSTON LOGGER instance ────────────────────────────────────
// In production (Docker/Railway) log to stdout only — no file system writes
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
  ],
});

// Helper methods to log structured events cleanly
export const sysLog = {
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  error: (message: string, error?: any, meta?: any) => {
    logger.error(message, {
      ...meta,
      errorName: error?.name,
      errorMessage: error?.message,
      errorStack: error?.stack,
    });
  },
  security: (message: string, meta?: any) => {
    logger.warn(`🛡️ [SECURITY] ${message}`, { ...meta, audit: true });
  },
};

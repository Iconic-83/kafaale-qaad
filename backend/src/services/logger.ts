import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure workspace logs directory exists
const LOGS_DIR = path.join(__dirname, '../../logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ── CUSTOM LOG FORMAT ────────────────────────────────────────────────
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
});

const colorizedFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  customFormat
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// ── CREATE WINSTON LOGGER instance ────────────────────────────────────
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // 1. Output error-level logs to error.log file
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    // 2. Output all logs (info & below) to combined.log file
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'combined.log'),
      format: fileFormat,
    }),
  ],
});

// If in development mode, add colorized console output
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: colorizedFormat,
    })
  );
}

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

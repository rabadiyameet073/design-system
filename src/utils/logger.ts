/**
 * Lightweight, production-safe logger utility
 * Suppresses debug/info logs in production environments
 */

const isProd = typeof process !== 'undefined' 
  ? process.env?.NODE_ENV === 'production'
  : (import.meta as any).env?.PROD;

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProd) {
      console.debug('[DSS Debug]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
      console.info('[DSS Info]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    console.warn('[DSS Warning]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[DSS Error]', ...args);
  }
};

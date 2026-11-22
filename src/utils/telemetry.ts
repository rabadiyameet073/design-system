/**
 * Privacy-Friendly Analytics & Telemetry Helper
 *
 * Principles:
 * 1. Zero third-party trackers or cross-site cookies.
 * 2. Only tracks product milestone events (e.g. step visited, export triggered, theme toggled).
 * 3. Stores events locally in localStorage (with in-memory fallback) for session diagnostics.
 */

export interface TelemetryEvent {
  eventName: string;
  timestamp: string;
  properties?: Record<string, any>;
}

const STORAGE_KEY = 'dss_telemetry_events_v1';
const MAX_STORED_EVENTS = 100;

// In-memory fallback for test and non-browser environments
let memoryEvents: TelemetryEvent[] = [];

export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  const event: TelemetryEvent = {
    eventName,
    timestamp: new Date().toISOString(),
    properties
  };

  memoryEvents.push(event);
  if (memoryEvents.length > MAX_STORED_EVENTS) {
    memoryEvents = memoryEvents.slice(-MAX_STORED_EVENTS);
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existingRaw = window.localStorage.getItem(STORAGE_KEY);
      const existing: TelemetryEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(event);

      const pruned = existing.slice(-MAX_STORED_EVENTS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    }
  } catch {
    // ignore storage errors
  }
}

export function getStoredTelemetryEvents(): TelemetryEvent[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // ignore
  }
  return [...memoryEvents];
}

export function clearTelemetryEvents(): void {
  memoryEvents = [];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

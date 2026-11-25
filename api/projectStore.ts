import fs from 'fs';
import path from 'path';

/**
 * Per-user project persistence abstraction.
 *
 * Local development keeps using the JSON-file adapter (`.data/users/<id>/projects.json`),
 * while production uses a serverless-safe HTTP REST adapter when the Upstash credentials
 * are configured. Serverless filesystems are ephemeral and often read-only, so file-based
 * persistence must never be the production path.
 */
export interface ProjectStore {
  readonly kind: 'local-file' | 'rest';
  read(userId: string): Promise<any[]>;
  write(userId: string, projects: any[]): Promise<void>;
  remove(userId: string): Promise<void>;
}

const DATA_DIR = path.resolve(process.cwd(), '.data', 'users');

function safeId(userId: string): string {
  return userId.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

function userFilePath(userId: string): string {
  const dir = path.join(DATA_DIR, safeId(userId));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'projects.json');
}

const localFileStore: ProjectStore = {
  kind: 'local-file',
  async read(userId: string): Promise<any[]> {
    try {
      const file = userFilePath(userId);
      if (!fs.existsSync(file)) return [];
      const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error(`Error reading projects for user ${userId}:`, err);
      return [];
    }
  },
  async write(userId: string, projects: any[]): Promise<void> {
    try {
      fs.writeFileSync(userFilePath(userId), JSON.stringify(projects, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing projects for user ${userId}:`, err);
    }
  },
  async remove(userId: string): Promise<void> {
    try {
      const file = userFilePath(userId);
      if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (err) {
      console.error(`Error deleting projects for user ${userId}:`, err);
    }
  }
};

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token && url.startsWith('http')) return { url, token };
  return null;
}

async function redisCommand(command: string[]): Promise<any> {
  const config = getRedisConfig()!;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`REST store responded ${res.status}`);
    const payload = (await res.json()) as { result?: unknown; error?: string };
    if (payload.error) throw new Error(payload.error);
    return payload.result;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Upstash-compatible REST adapter. Each user's projects are a single JSON string key,
 * so read/write are atomic and work across serverless instances and regions.
 */
const restStore: ProjectStore = {
  kind: 'rest',
  async read(userId: string): Promise<any[]> {
    try {
      const raw = await redisCommand(['GET', projectKey(userId)]);
      if (!raw || typeof raw !== 'string') return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error(`Error reading projects from REST store for ${userId}:`, err);
      return [];
    }
  },
  async write(userId: string, projects: any[]): Promise<void> {
    await redisCommand(['SET', projectKey(userId), JSON.stringify(projects)]);
  },
  async remove(userId: string): Promise<void> {
    await redisCommand(['DEL', projectKey(userId)]);
  }
};

function projectKey(userId: string): string {
  return `dss:projects:${safeId(userId)}`;
}

/** The active store is selected once at startup from environment configuration. */
export const projectStore: ProjectStore = getRedisConfig() ? restStore : localFileStore;

export async function checkSharedRateLimit(
  bucket: string,
  key: string,
  limit: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  const config = getRedisConfig();
  if (!config) {
    // Local dev falls back to the in-memory limiter in api/index.ts.
    return { allowed: true, retryAfter: 0 };
  }
  try {
    const redisKey = `dss:ratelimit:${bucket}:${key}`;
    const count = await redisCommand(['INCR', redisKey]);
    if (count === 1) {
      await redisCommand(['EXPIRE', redisKey, '60']);
    }
    return Number(count) <= limit
      ? { allowed: true, retryAfter: 0 }
      : { allowed: false, retryAfter: 60 };
  } catch (err) {
    console.error('Shared rate limit check failed (failing open):', err);
    return { allowed: true, retryAfter: 0 };
  }
}

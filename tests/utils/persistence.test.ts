import { describe, it, expect, afterAll } from 'vitest';
import { projectStore } from '../../api/projectStore';
import { mergeProjectsByRecency } from '../../src/services/projectSync';

const TEST_USER = `test_user_${process.pid}`;

const project = (id: string, updatedAt: number, name: string) => ({
  id,
  name,
  schemaVersion: 1,
  updatedAt
});

describe('per-user persistence abstraction', () => {
  afterAll(async () => {
    await projectStore.remove(TEST_USER);
  });

  it('selects the local file adapter when no REST credentials are configured', () => {
    const restConfigured = Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    );
    expect(projectStore.kind).toBe(restConfigured ? 'rest' : 'local-file');
  });

  it('round-trips projects through the active store', async () => {
    await projectStore.write(TEST_USER, [project('p1', 100, 'First')]);
    expect(await projectStore.read(TEST_USER)).toEqual([project('p1', 100, 'First')]);

    await projectStore.write(TEST_USER, [project('p2', 200, 'Second')]);
    const stored = await projectStore.read(TEST_USER);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('p2');
  });

  it('removes a user store', async () => {
    await projectStore.remove(TEST_USER);
    expect(await projectStore.read(TEST_USER)).toEqual([]);
  });
});

describe('mergeProjectsByRecency', () => {
  it('keeps the newest version of each project regardless of list order', () => {
    const local = [project('a', 100, 'old local'), project('b', 300, 'new local')];
    const remote = [project('a', 200, 'new remote'), project('b', 150, 'old remote'), project('c', 50, 'remote only')];

    const merged = mergeProjectsByRecency(local as any, remote as any);

    expect(merged.find(p => p.id === 'a')?.name).toBe('new remote');
    expect(merged.find(p => p.id === 'b')?.name).toBe('new local');
    expect(merged.find(p => p.id === 'c')?.name).toBe('remote only');
    expect(merged[0].id).toBe('b');
  });
});

import { DesignProject } from '../types/designSystem';

export interface UserProjectRecord {
  id: string;
  userId: string;
  name: string;
  websiteTypeId: string;
  websiteTypeName: string;
  currentStep: number;
  data: DesignProject;
  createdAt: string;
  updatedAt: string;
}

// Transparent local-first and multi-tab sync using BroadcastChannel and Web Storage (Zero remote tracking)
const SYNC_CHANNEL_NAME = 'dss_projects_tab_sync_channel';
const LOCAL_STORAGE_PREFIX = 'dss_user_projects_';

function getUserProjectsKey(userId: string): string {
  return `${LOCAL_STORAGE_PREFIX}${userId}`;
}

function loadProjectsFromStorage(userId: string): DesignProject[] {
  try {
    const raw = localStorage.getItem(getUserProjectsKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProjectsToStorage(userId: string, projects: DesignProject[]): void {
  try {
    localStorage.setItem(getUserProjectsKey(userId), JSON.stringify(projects));
  } catch (err) {
    console.warn('Storage sync error:', err);
  }
}

/**
 * Subscribes to real-time multi-tab updates for projects belonging to the user.
 * Operates offline-first and syncs seamlessly between browser tabs and windows.
 */
export function subscribeToUserProjects(
  userId: string,
  onProjectsUpdated: (projects: DesignProject[]) => void,
  _onError?: (err: any) => void
): () => void {
  // Initial load
  const initial = loadProjectsFromStorage(userId);
  if (initial.length > 0) {
    onProjectsUpdated(initial);
  }

  let channel: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.userId === userId) {
          const updated = loadProjectsFromStorage(userId);
          onProjectsUpdated(updated);
        }
      };
    }
  } catch (e) {
    console.warn('BroadcastChannel notice:', e);
  }

  const storageHandler = (event: StorageEvent) => {
    if (event.key === getUserProjectsKey(userId)) {
      const updated = loadProjectsFromStorage(userId);
      onProjectsUpdated(updated);
    }
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Saves or updates a project for the authenticated user in local storage and broadcasts to other tabs.
 */
export async function saveProjectToStorage(
  userId: string,
  project: DesignProject
): Promise<void> {
  const current = loadProjectsFromStorage(userId);
  const existingIdx = current.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: Date.now()
  };

  let nextProjects: DesignProject[];
  if (existingIdx >= 0) {
    nextProjects = [...current];
    nextProjects[existingIdx] = updatedProject;
  } else {
    nextProjects = [updatedProject, ...current];
  }

  saveProjectsToStorage(userId, nextProjects);

  // Broadcast real-time update to other tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ type: 'PROJECT_UPDATED', userId, projectId: project.id });
      channel.close();
    }
  } catch (e) {
    // ignore
  }
}

// Backward-compatible alias
export const saveProjectToCloud = saveProjectToStorage;

/**
 * Deletes a project from local user store.
 */
export async function deleteProjectFromStorage(
  userId: string,
  projectId: string
): Promise<void> {
  const current = loadProjectsFromStorage(userId);
  const filtered = current.filter(p => p.id !== projectId);
  saveProjectsToStorage(userId, filtered);

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ type: 'PROJECT_DELETED', userId, projectId });
      channel.close();
    }
  } catch (e) {
    // ignore
  }
}

// Backward-compatible alias
export const deleteProjectFromCloud = deleteProjectFromStorage;

/**
 * Merges projects into the user's local multi-tab store.
 */
export async function syncLocalProjectsToUserStore(
  userId: string,
  localProjects: DesignProject[]
): Promise<number> {
  const current = loadProjectsFromStorage(userId);
  const map = new Map<string, DesignProject>();
  current.forEach(p => map.set(p.id, p));
  localProjects.forEach(p => {
    const existing = map.get(p.id);
    if (!existing || (p.updatedAt || 0) > (existing.updatedAt || 0)) {
      map.set(p.id, p);
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  saveProjectsToStorage(userId, merged);
  return merged.length;
}

// Backward-compatible alias
export const syncLocalProjectsToCloud = syncLocalProjectsToUserStore;


import { DesignProject } from '../types/designSystem';

export interface CloudProjectRecord {
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

// Real-time synchronization using BroadcastChannel & storage events (Zero Firebase)
const SYNC_CHANNEL_NAME = 'dss_projects_sync_channel';
const CLOUD_STORAGE_PREFIX = 'dss_cloud_projects_';

function getCloudProjectsKey(userId: string): string {
  return `${CLOUD_STORAGE_PREFIX}${userId}`;
}

function loadProjectsFromStorage(userId: string): DesignProject[] {
  try {
    const raw = localStorage.getItem(getCloudProjectsKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProjectsToStorage(userId: string, projects: DesignProject[]): void {
  try {
    localStorage.setItem(getCloudProjectsKey(userId), JSON.stringify(projects));
  } catch (err) {
    console.warn('Storage sync error:', err);
  }
}

/**
 * Subscribes to real-time updates for projects owned by the authenticated user.
 * Works seamlessly across browser tabs and windows without Firebase.
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
    if (event.key === getCloudProjectsKey(userId)) {
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
 * Saves or updates a project for the authenticated user in real-time.
 */
export async function saveProjectToCloud(
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

/**
 * Deletes a project.
 */
export async function deleteProjectFromCloud(
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

/**
 * Bulk imports local projects to the authenticated user's store.
 */
export async function syncLocalProjectsToCloud(
  userId: string,
  localProjects: DesignProject[]
): Promise<number> {
  const current = loadProjectsFromStorage(userId);
  const map = new Map<string, DesignProject>();
  current.forEach(p => map.set(p.id, p));
  localProjects.forEach(p => {
    if (!map.has(p.id)) {
      map.set(p.id, p);
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  saveProjectsToStorage(userId, merged);
  return merged.length;
}

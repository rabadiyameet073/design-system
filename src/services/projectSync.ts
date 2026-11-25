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
 * Loads from both local cache and backend JSON storage, keeping them seamlessly synchronized.
 */
export function subscribeToUserProjects(
  userId: string,
  onProjectsUpdated: (projects: DesignProject[]) => void,
  _onError?: (err: any) => void
): () => void {
  // 1. Immediate local cache load
  const initial = loadProjectsFromStorage(userId);
  if (initial.length > 0) {
    onProjectsUpdated(initial);
  }

  // 2. Background fetch from backend JSON user storage
  fetchUserProjectsFromServer(userId)
    .then((serverProjects) => {
      if (serverProjects && serverProjects.length > 0) {
        onProjectsUpdated(serverProjects);
      }
    })
    .catch((err) => {
      console.warn('Backend user projects fetch notice:', err);
    });

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
 * Loads projects from backend JSON user storage.
 */
export async function fetchUserProjectsFromServer(userId: string): Promise<DesignProject[]> {
  try {
    const res = await fetch('/api/user/projects');
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success && Array.isArray(data.projects)) {
      saveProjectsToStorage(userId, data.projects);
      return data.projects;
    }
    return [];
  } catch (e) {
    console.warn('Could not connect to backend user projects endpoint:', e);
    return loadProjectsFromStorage(userId);
  }
}

/**
 * Saves or updates a project for the authenticated user in local storage AND sends to backend JSON store.
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

  // Send asynchronous background write to backend JSON user storage
  fetch('/api/user/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: updatedProject })
  }).catch((err) => {
    console.warn('Backend project persistence notice:', err);
  });

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
 * Deletes a project from local user store and backend JSON file.
 */
export async function deleteProjectFromStorage(
  userId: string,
  projectId: string
): Promise<void> {
  const current = loadProjectsFromStorage(userId);
  const filtered = current.filter(p => p.id !== projectId);
  saveProjectsToStorage(userId, filtered);

  // Send delete to backend JSON user storage
  fetch(`/api/user/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE'
  }).catch((err) => {
    console.warn('Backend project deletion notice:', err);
  });

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
 * Merges projects into the user's local multi-tab store and syncs with backend JSON store.
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

  // Send bulk sync to backend JSON store
  fetch('/api/user/projects/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projects: merged })
  }).catch((err) => {
    console.warn('Backend project sync notice:', err);
  });

  return merged.length;
}

// Backward-compatible alias
export const syncLocalProjectsToCloud = syncLocalProjectsToUserStore;


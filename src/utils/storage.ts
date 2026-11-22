import { DesignProject } from '../types/designSystem';
import { SAMPLE_PROJECT_CERAMICS, SAMPLE_PROJECT_SAAS, createNewProject } from '../data/sampleProjects';
import { migrateTokens } from '../tokens/migration';
import { validateProjectData, validateTokensData } from './projectSchema';
import { logger } from './logger';

const STORAGE_KEY_PROJECTS = 'dss_projects_v1';
const STORAGE_KEY_ACTIVE_ID = 'dss_active_project_id_v1';

export function getStoredProjects(): DesignProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      // Seed with sample projects so user has high quality starting points
      const defaultProjects = [SAMPLE_PROJECT_CERAMICS, SAMPLE_PROJECT_SAAS];
      saveProjects(defaultProjects);
      return defaultProjects;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [SAMPLE_PROJECT_CERAMICS];
  } catch (e) {
    logger.error('Failed to load projects from storage:', e);
    return [SAMPLE_PROJECT_CERAMICS];
  }
}

export function saveProjects(projects: DesignProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      window.dispatchEvent(new CustomEvent('dss:storage-quota-exceeded'));
      logger.error('LocalStorage quota exceeded. Please export and remove older projects.', e);
    } else {
      logger.error('Failed to persist projects to storage:', e);
    }
  }
}

export function getActiveProjectId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (active) return active;
    const projects = getStoredProjects();
    return projects[0]?.id || SAMPLE_PROJECT_CERAMICS.id;
  } catch {
    return SAMPLE_PROJECT_CERAMICS.id;
  }
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (e) {
    logger.error('Failed to set active project id:', e);
  }
}

// Immediate synchronous write
export function saveProjectImmediately(
  project: DesignProject,
  opts: { makeActive?: boolean } = { makeActive: true }
): void {
  const projects = getStoredProjects();
  const existingIdx = projects.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    schemaVersion: project.schemaVersion || 1,
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    projects[existingIdx] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  saveProjects(projects);
  if (opts.makeActive !== false) {
    setActiveProjectId(project.id);
  }
}

// Debounce timer for continuous slider updates (Doc 03 §3)
let debounceSaveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingProjectToSave: DesignProject | null = null;

export function saveProject(
  project: DesignProject,
  debounceMs: number = 350,
  opts: { makeActive?: boolean } = { makeActive: true }
): void {
  pendingProjectToSave = project;

  if (debounceMs <= 0) {
    if (debounceSaveTimer) {
      clearTimeout(debounceSaveTimer);
      debounceSaveTimer = null;
    }
    saveProjectImmediately(project, opts);
    pendingProjectToSave = null;
    return;
  }

  if (debounceSaveTimer) {
    clearTimeout(debounceSaveTimer);
  }

  debounceSaveTimer = setTimeout(() => {
    if (pendingProjectToSave) {
      saveProjectImmediately(pendingProjectToSave, opts);
      pendingProjectToSave = null;
    }
    debounceSaveTimer = null;
  }, debounceMs);
}

export function deleteProject(id: string): DesignProject[] {
  if (debounceSaveTimer) {
    clearTimeout(debounceSaveTimer);
    debounceSaveTimer = null;
  }

  const projects = getStoredProjects().filter(p => p.id !== id);
  if (projects.length === 0) {
    const fallback = createNewProject('My New Website', 'ecommerce');
    projects.push(fallback);
  }
  saveProjects(projects);
  setActiveProjectId(projects[0].id);
  return projects;
}

export function duplicateProject(id: string): DesignProject {
  const projects = getStoredProjects();
  const original = projects.find(p => p.id === id) || SAMPLE_PROJECT_CERAMICS;

  const clone: DesignProject = {
    ...JSON.parse(JSON.stringify(original)),
    id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `${original.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  projects.unshift(clone);
  saveProjects(projects);
  setActiveProjectId(clone.id);
  return clone;
}

export function exportProjectAsJson(project: DesignProject): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_design_system.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProjectFromJson(jsonString: string): DesignProject {
  // Size limit check (2 MB per Doc 05 §2)
  if (jsonString.length > 2 * 1024 * 1024) {
    throw new Error('Project file exceeds maximum size limit of 2 MB.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON structure.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Imported JSON is not a valid object.');
  }

  const rawObj = parsed as Record<string, any>;

  // Case A: Standalone DesignTokens file (e.g. project.dss.json)
  if (rawObj.schemaVersion || (rawObj.color && rawObj.typography && !rawObj.websiteType)) {
    const tokensValidation = validateTokensData(rawObj);
    if (!tokensValidation.success) {
      throw new Error(`Token validation failed: ${tokensValidation.error.issues.map(i => i.message).join(', ')}`);
    }

    const tokens = migrateTokens(tokensValidation.data as any);
    const projectName = tokens.meta?.projectName || 'Imported Design System';
    const genreId = tokens.meta?.genreId || 'ceramics-atelier';
    const baseProject = createNewProject(projectName, genreId);

    const project: DesignProject = {
      ...baseProject,
      id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: projectName,
      tokens,
      updatedAt: Date.now()
    };

    saveProjectImmediately(project);
    return project;
  }

  // Case B: Full DesignProject structure validated via Zod
  const projectValidation = validateProjectData(rawObj);
  if (!projectValidation.success) {
    throw new Error(`Project schema validation failed: ${projectValidation.error.issues.map(i => i.message).join(', ')}`);
  }

  const validData = projectValidation.data;

  // Migrate tokens inside project if present
  let tokens: any = validData.tokens;
  try {
    if (tokens) {
      tokens = migrateTokens(tokens);
    }
  } catch (err) {
    logger.warn('Could not fully migrate nested tokens, using fallback:', err);
  }

  const newProject: DesignProject = {
    ...(validData as any),
    id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tokens: (tokens || validData.tokens) as any,
    updatedAt: Date.now()
  };

  saveProjectImmediately(newProject);
  return newProject;
}

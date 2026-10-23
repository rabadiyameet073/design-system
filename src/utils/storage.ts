import { DesignProject } from '../types/designSystem';
import { SAMPLE_PROJECT_CERAMICS, SAMPLE_PROJECT_SAAS, createNewProject } from '../data/sampleProjects';

const STORAGE_KEY_PROJECTS = 'dss_projects_v1';
const STORAGE_KEY_ACTIVE_ID = 'dss_active_project_id_v1';

export function getStoredProjects(): DesignProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      // Seed with sample projects so founder has high quality starting points
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
    console.error('Failed to load projects from storage:', e);
    return [SAMPLE_PROJECT_CERAMICS];
  }
}

export function saveProjects(projects: DesignProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to persist projects to storage:', e);
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
    console.error('Failed to set active project id:', e);
  }
}

export function saveProject(project: DesignProject): void {
  const projects = getStoredProjects();
  const existingIdx = projects.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    projects[existingIdx] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  saveProjects(projects);
  setActiveProjectId(project.id);
}

export function deleteProject(id: string): DesignProject[] {
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
  const parsed = JSON.parse(jsonString) as DesignProject;
  if (!parsed.name || !parsed.colorPalette || !parsed.typography) {
    throw new Error('Invalid design system file structure');
  }

  const newProject: DesignProject = {
    ...parsed,
    id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    updatedAt: Date.now()
  };

  saveProject(newProject);
  return newProject;
}

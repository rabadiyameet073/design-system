import React, { useState, useMemo } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  Calendar,
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Cloud,
  Search,
  ArrowUpDown,
  LayoutGrid,
  List,
  HardDrive,
  RotateCcw,
  AlertTriangle,
  X,
  FileCheck
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import {
  saveProject,
  deleteProject,
  duplicateProject,
  exportProjectAsJson,
  importProjectFromJson
} from '../../utils/storage';
import { createNewProject } from '../../data/sampleProjects';
import { useAuth } from '../../context/auth-context';
import { ConfirmModal } from '../common/ConfirmModal';
import { saveProjectToCloud, deleteProjectFromCloud } from '../../services/projectSync';

interface ProjectDashboardProps {
  projects: DesignProject[];
  activeProjectId: string;
  onSelectProject: (id: string, continueWizard?: boolean) => void;
  onRefreshProjects: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onRefreshProjects
}) => {
  const { user, setIsOAuthModalOpen } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState('ecommerce');

  // Search, Sort & View Mode (Doc 02 §4)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Delete & Soft-Delete Undo state
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<DesignProject | null>(null);

  // Import JSON status state
  const [importReport, setImportReport] = useState<{
    isOpen: boolean;
    success: boolean;
    projectName?: string;
    details?: string;
  }>({ isOpen: false, success: false });

  // Calculate LocalStorage capacity
  const storageMetrics = useMemo(() => {
    if (typeof window === 'undefined') return { usedKb: 0, percent: 0, isHigh: false };
    let totalBytes = 0;
    try {
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          totalBytes += (localStorage[key].length + key.length) * 2;
        }
      }
    } catch {
      // Ignore
    }
    const usedKb = Math.round(totalBytes / 1024);
    const percent = Math.min(100, Math.round((usedKb / 5120) * 100)); // 5 MB typical quota
    return {
      usedKb,
      percent,
      isHigh: percent > 75
    };
  }, [projects]);

  const handleCreate = () => {
    if (!user) {
      setIsOAuthModalOpen(true);
      return;
    }
    const project = createNewProject(newProjectName || 'My New Website', newProjectType);
    project.currentStep = 1;
    project.completedSteps = [];
    saveProject(project);
    if (user?.id) {
      saveProjectToCloud(user.id, project);
    }
    onRefreshProjects();
    setShowNewModal(false);
    onSelectProject(project.id, true);
  };

  const handleDeleteRequest = (id: string, name: string) => {
    setProjectToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const targetProject = projects.find(p => p.id === projectToDelete.id);
    if (targetProject) {
      setRecentlyDeleted(targetProject);
    }
    deleteProject(projectToDelete.id);
    if (user?.id) {
      deleteProjectFromCloud(user.id, projectToDelete.id);
    }
    onRefreshProjects();
    setProjectToDelete(null);
  };

  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      saveProject(recentlyDeleted);
      if (user?.id) {
        saveProjectToCloud(user.id, recentlyDeleted);
      }
      onRefreshProjects();
      setRecentlyDeleted(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const clone = duplicateProject(id);
    if (clone && user?.id) {
      saveProjectToCloud(user.id, clone);
    }
    onRefreshProjects();
    onSelectProject(clone.id, false);
  };

  const handleStartRename = (project: DesignProject) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleSaveRename = (project: DesignProject) => {
    if (editName.trim()) {
      saveProject({ ...project, name: editName.trim() });
      onRefreshProjects();
    }
    setEditingId(null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const content = event.target?.result as string;
          const imported = importProjectFromJson(content);
          onRefreshProjects();
          setImportReport({
            isOpen: true,
            success: true,
            projectName: imported.name,
            details: `Successfully imported "${imported.name}" with full tokens and archetype configuration.`
          });
          onSelectProject(imported.id, false);
        } catch (err: any) {
          setImportReport({
            isOpen: true,
            success: false,
            details: err?.message || 'Invalid design system JSON format or schema mismatch.'
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.websiteType.name.toLowerCase().includes(q) ||
          p.websiteType.category.toLowerCase().includes(q) ||
          p.visualDirection.name.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'updated') return (b.updatedAt || 0) - (a.updatedAt || 0);
        if (sortBy === 'created') return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [projects, searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <img src="/icon.png" alt="D" className="w-6 h-6 rounded-md object-contain drop-shadow-2xs" />
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Your Design System Projects
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Manage your websites, resume guided wizards, and export developer specifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 cursor-pointer transition-colors shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (!user) {
                setIsOAuthModalOpen(true);
                return;
              }
              setShowNewModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-xs font-sans tracking-wide cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Design System</span>
          </button>
        </div>
      </div>

      {/* Storage Capacity Warning / Meter (Doc 02 §4) */}
      <div className="mb-6 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <HardDrive className={`w-4 h-4 ${storageMetrics.isHigh ? 'text-amber-500' : 'text-neutral-500'}`} />
          <div>
            <span className="font-semibold text-neutral-800">Browser Storage Usage: </span>
            <span className="font-mono text-neutral-600">{storageMetrics.usedKb} KB / ~5,120 KB ({storageMetrics.percent}%)</span>
          </div>
        </div>

        {storageMetrics.isHigh && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Storage is nearing browser quota. Export JSON backups to keep data safe.</span>
          </span>
        )}
      </div>

      {/* Soft-Delete Undo Toast */}
      {recentlyDeleted && (
        <div className="mb-6 p-3 bg-neutral-900 text-white rounded-xl shadow-lg flex items-center justify-between gap-4 text-xs">
          <span>Deleted project "{recentlyDeleted.name}".</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndoDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-neutral-900 font-bold hover:bg-neutral-100 cursor-pointer text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo</span>
            </button>
            <button
              onClick={() => setRecentlyDeleted(null)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Google Auth & Cloud Sync Status Banner */}
      {user ? (
        <div className="mb-6 p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                <span>Real-Time Cloud Sync Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <p className="text-[11px] text-emerald-800/80 truncate">
                Authenticated as <strong className="font-medium text-emerald-900">{user.email || user.name}</strong>. Projects update in real-time.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
            UID: {user.id.slice(0, 10)}...
          </span>
        </div>
      ) : (
        <div className="mb-6 p-3.5 bg-neutral-100/90 border border-neutral-200 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-neutral-600 flex items-center justify-center shadow-2xs shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-neutral-900">Cloud Backup & Real-Time Sync</span>
              <p className="text-[11px] text-neutral-500">
                Sign in with Google to automatically back up your design systems and access them anywhere.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-semibold rounded-lg shadow-2xs transition-all shrink-0 text-xs cursor-pointer"
          >
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Filter, Search & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        {/* Sort & Grid/List Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs border border-neutral-200 bg-white rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center border border-neutral-200 rounded-lg p-0.5 bg-neutral-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'}`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-800">No design systems match your search.</p>
          <p className="text-xs text-neutral-500 mt-1">Try a different keyword or create a new project.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(p => {
            const isActive = p.id === activeProjectId;
            const isCompleted = p.currentStep >= 11;
            const completionPercent = Math.min(100, Math.round((p.currentStep / 11) * 100));

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all shadow-xs flex flex-col justify-between ${
                  isActive ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div>
                  {/* Visual Swatch Header strip */}
                  <div
                    className="h-20 p-4 flex items-end justify-between border-b border-black/5 relative"
                    style={{ backgroundColor: p.colorPalette.background }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: p.colorPalette.primary }}
                        title={`Primary: ${p.colorPalette.primary}`}
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: p.colorPalette.secondary }}
                        title={`Secondary: ${p.colorPalette.secondary}`}
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: p.colorPalette.accent }}
                        title={`Accent: ${p.colorPalette.accent}`}
                      />
                    </div>

                    <span className="text-[11px] font-semibold text-neutral-600 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
                      {p.websiteType.category}
                    </span>
                  </div>

                  {/* Content body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-1.5 w-full">
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="px-2 py-1 text-xs border border-neutral-300 rounded font-semibold w-full focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleSaveRename(p)}
                          />
                          <button
                            onClick={() => handleSaveRename(p)}
                            className="px-2 py-1 bg-neutral-900 text-white text-[11px] font-bold rounded cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-neutral-900 tracking-tight">{p.name}</h3>
                          <button
                            onClick={() => handleStartRename(p)}
                            className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                            title="Rename project"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                      {p.business.offering || p.websiteType.description}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-neutral-500 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between">
                        <span>Direction:</span>
                        <strong className="text-neutral-700 font-medium">{p.visualDirection.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fonts:</span>
                        <strong className="text-neutral-700 font-medium">{p.typography.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Step progress:</span>
                        <strong className="text-neutral-700 font-medium">Step {p.currentStep} of 11 ({completionPercent}%)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 rounded transition-colors cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exportProjectAsJson(p)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 rounded transition-colors cursor-pointer"
                      title="Export JSON backup"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => handleDeleteRequest(p.id, p.name)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectProject(p.id, false)}
                      className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      Workspace
                    </button>
                    <button
                      onClick={() => onSelectProject(p.id, true)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                    >
                      {isCompleted ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100 shadow-xs">
          {filteredProjects.map(p => {
            const isActive = p.id === activeProjectId;
            const isCompleted = p.currentStep >= 11;

            return (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 border border-black/10 flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: p.colorPalette.primary }}
                  />
                  <div className="truncate">
                    <h3 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <span>{p.websiteType.category}</span>
                      <span>·</span>
                      <span>{p.visualDirection.name}</span>
                      <span>·</span>
                      <span>Step {p.currentStep} of 11</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectProject(p.id, false)}
                    className="px-3 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={() => onSelectProject(p.id, true)}
                    className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer"
                  >
                    {isCompleted ? 'Review' : 'Continue'}
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDeleteRequest(p.id, p.name)}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (Replacing window.confirm) */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title={`Delete "${projectToDelete?.name}"?`}
        description="Are you sure you want to delete this design system? You will have an opportunity to undo this action right after deletion."
        confirmLabel="Delete Project"
        cancelLabel="Keep Project"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />

      {/* Import Report Modal (Replacing window.alert) */}
      {importReport.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                importReport.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {importReport.success ? <FileCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">
                  {importReport.success ? 'Project Imported Successfully' : 'Import Failed'}
                </h3>
                <span className="text-[11px] text-neutral-500">Design System JSON Processor</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {importReport.details}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setImportReport(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">Create New Design System</h2>
            <p className="text-xs text-neutral-500 mb-4">
              Enter your website name and select a starter type.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Website / Brand Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="e.g. Lumin Studio, Solis Health..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Website Category
                </label>
                <select
                  value={newProjectType}
                  onChange={e => setNewProjectType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white cursor-pointer"
                >
                  <option value="ecommerce">Online Store & E-commerce</option>
                  <option value="saas-product">SaaS Product</option>
                  <option value="personal-portfolio">Personal Portfolio</option>
                  <option value="education-platform">Education Platform</option>
                  <option value="digital-agency">Digital Agency</option>
                  <option value="corporate-business">Corporate Business</option>
                  <option value="ai-tool">AI Tool & Application</option>
                  <option value="custom">Other / Custom</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

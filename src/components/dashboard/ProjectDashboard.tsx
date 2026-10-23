import React, { useState } from 'react';
import {
  Plus,
  Copy,
  Trash2,
  Edit2,
  Download,
  Upload,
  ExternalLink,
  Calendar,
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import {
  saveProject,
  deleteProject,
  duplicateProject,
  exportProjectAsJson,
  importProjectFromJson
} from '../../utils/storage';
import { createNewProject, SAMPLE_PROJECT_CERAMICS, SAMPLE_PROJECT_SAAS } from '../../data/sampleProjects';
import { useAuth } from '../../context/auth-context';

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

  const handleCreate = () => {
    const project = createNewProject(newProjectName || 'My New Website', newProjectType);
    saveProject(project);
    onRefreshProjects();
    setShowNewModal(false);
    onSelectProject(project.id, true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProject(id);
      onRefreshProjects();
    }
  };

  const handleDuplicate = (id: string) => {
    const clone = duplicateProject(id);
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
          onSelectProject(imported.id, false);
        } catch (err) {
          alert('Could not import design system JSON file. Please check file formatting.');
        }
      };
      reader.readAsText(file);
    }
  };

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
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-xs font-sansation tracking-wide"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Design System</span>
          </button>
        </div>
      </div>

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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-semibold rounded-lg shadow-2xs transition-all shrink-0 text-xs"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(p => {
          const isActive = p.id === activeProjectId;
          const isCompleted = p.currentStep >= 13;

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
                          className="px-2 py-1 bg-neutral-900 text-white text-[11px] font-bold rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-neutral-900 tracking-tight">{p.name}</h3>
                        <button
                          onClick={() => handleStartRename(p)}
                          className="text-neutral-400 hover:text-neutral-700"
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
                      <strong className="text-neutral-700 font-medium">Step {p.currentStep} of 14</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(p.id)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 rounded transition-colors"
                    title="Duplicate project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => exportProjectAsJson(p)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/60 rounded transition-colors"
                    title="Export JSON backup"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectProject(p.id, false)}
                    className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={() => onSelectProject(p.id, true)}
                    className="px-3 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    {isCompleted ? 'Review' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
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
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs"
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

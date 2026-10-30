import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/common/Header';
import { WizardNav } from './components/common/WizardNav';
import { LandingPage } from './components/landing/LandingPage';
import { ProjectDashboard } from './components/dashboard/ProjectDashboard';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { StepTransition } from './components/common/StepTransition';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';
import { OAuthModal } from './components/auth/OAuthModal';

// 11-Step Modular Wizard Components
import { Step1CategoryGenre } from './components/wizard/Step1CategoryGenre';
import { Step2ProjectBusiness } from './components/wizard/Step2ProjectBusiness';
import { Step3BrandPersonality } from './components/wizard/Step3BrandPersonality';
import { Step5VisualDirection } from './components/wizard/Step5VisualDirection';
import { Step6ColorStudio } from './components/wizard/Step6ColorStudio';
import { Step6TypographyStudio } from './components/wizard/Step6TypographyStudio';
import { Step9LayoutSpacing } from './components/wizard/Step9LayoutSpacing';
import { Step10ComponentsStudio } from './components/wizard/Step10ComponentsStudio';
import { Step8ImageryStudio } from './components/wizard/Step8ImageryStudio';
import { Step10ReviewAudit } from './components/wizard/Step10ReviewAudit';
import { Step11ExportCenter } from './components/wizard/Step11ExportCenter';
import { WizardWorkspaceStage } from './components/wizard/WizardWorkspaceStage';

import { DesignProject } from './types/designSystem';
import {
  getStoredProjects,
  saveProject,
  getActiveProjectId,
  setActiveProjectId
} from './utils/storage';
import { createNewProject, SAMPLE_PROJECT_CERAMICS } from './data/sampleProjects';
import {
  subscribeToUserProjects,
  saveProjectToCloud,
  syncLocalProjectsToCloud
} from './services/projectSync';

function MainStudio() {
  const { user } = useAuth();
  const [view, setView] = useState<'landing' | 'wizard' | 'dashboard' | 'workspace'>('landing');
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [activeProjectId, setActiveId] = useState<string>('');
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);

  // Draft preview and undo/redo state
  const [draftProject, setDraftProject] = useState<Partial<DesignProject> | null>(null);
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [history, setHistory] = useState<DesignProject[]>([]);
  const [future, setFuture] = useState<DesignProject[]>([]);

  // Initialize projects on load
  useEffect(() => {
    const loadedProjects = getStoredProjects();
    const storedActiveId = getActiveProjectId();
    setProjects(loadedProjects);

    const exists = loadedProjects.some(p => p.id === storedActiveId);
    const active = exists ? storedActiveId : loadedProjects[0]?.id || SAMPLE_PROJECT_CERAMICS.id;
    setActiveId(active);
  }, []);

  // Real-time synchronization of projects when logged in with Google or account
  useEffect(() => {
    if (!user) return;

    const currentLocals = getStoredProjects();
    syncLocalProjectsToCloud(user.id, currentLocals).catch(e => {
      console.warn('Initial cloud sync notice:', e);
    });

    const unsubscribe = subscribeToUserProjects(
      user.id,
      (cloudProjects) => {
        if (cloudProjects.length > 0) {
          setProjects(prev => {
            const map = new Map<string, DesignProject>();
            prev.forEach(p => map.set(p.id, p));
            cloudProjects.forEach(cp => {
              map.set(cp.id, cp);
              saveProject(cp);
            });
            return Array.from(map.values()).sort(
              (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
            );
          });
        }
      },
      (err) => {
        console.warn('Real-time project listener warning:', err);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const activeProject =
    projects.find(p => p.id === activeProjectId) || projects[0] || SAMPLE_PROJECT_CERAMICS;

  const refreshProjectsList = useCallback(() => {
    const list = getStoredProjects();
    setProjects(list);
  }, []);

  // Update active project with autosave and real-time cloud sync
  const handleUpdateActiveProject = useCallback((updates: Partial<DesignProject>) => {
    setIsAutosaving(true);
    setProjects(prevProjects => {
      const updated = prevProjects.map(p => {
        if (p.id === activeProject.id) {
          // Push to undo history before mutation
          setHistory(h => [...h.slice(-15), p]);
          setFuture([]); // clear redo on new change

          const next = { ...p, ...updates, updatedAt: Date.now() };
          saveProject(next);
          if (user) {
            saveProjectToCloud(user.id, next).catch(e => {
              console.warn('Cloud autosave note:', e);
            });
          }
          return next;
        }
        return p;
      });
      return updated;
    });

    setTimeout(() => {
      setIsAutosaving(false);
    }, 400);
  }, [activeProject.id, user]);

  // Draft Preview Handlers
  const handlePreviewDraft = useCallback((draft: Partial<DesignProject>, label: string) => {
    setDraftProject(draft);
    setDraftLabel(label);
  }, []);

  const handleClearDraft = useCallback(() => {
    setDraftProject(null);
    setDraftLabel(null);
  }, []);

  const handleApplyDraft = useCallback(() => {
    if (draftProject) {
      handleUpdateActiveProject(draftProject);
      setDraftProject(null);
      setDraftLabel(null);
    }
  }, [draftProject, handleUpdateActiveProject]);

  // Undo / Redo Handlers
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setFuture(f => [activeProject, ...f]);
      setHistory(h => h.slice(0, h.length - 1));
      saveProject(prev);
      setProjects(list => list.map(p => p.id === prev.id ? prev : p));
    }
  }, [history, activeProject]);

  const handleRedo = useCallback(() => {
    if (future.length > 0) {
      const next = future[0];
      setHistory(h => [...h, activeProject]);
      setFuture(f => f.slice(1));
      saveProject(next);
      setProjects(list => list.map(p => p.id === next.id ? next : p));
    }
  }, [future, activeProject]);

  // Step Navigation handlers
  const handleNextStep = () => {
    handleClearDraft();
    if (activeProject.currentStep < 11) {
      const nextStep = activeProject.currentStep + 1;
      const completed = Array.from(new Set([...activeProject.completedSteps, activeProject.currentStep]));
      handleUpdateActiveProject({
        currentStep: nextStep,
        completedSteps: completed
      });
    } else {
      setView('workspace');
    }
  };

  const handleBackStep = () => {
    handleClearDraft();
    if (activeProject.currentStep > 1) {
      handleUpdateActiveProject({
        currentStep: activeProject.currentStep - 1
      });
    }
  };

  const handleSelectStep = (stepNumber: number) => {
    handleClearDraft();
    handleUpdateActiveProject({
      currentStep: stepNumber
    });
  };

  const handleResetCurrentStep = () => {
    if (window.confirm('Reset this step to recommended defaults?')) {
      const fresh = createNewProject(activeProject.name, activeProject.websiteType.id);
      switch (activeProject.currentStep) {
        case 3:
          handleUpdateActiveProject({ brandPersonality: fresh.brandPersonality, tokens: { ...activeProject.tokens, meta: { ...activeProject.tokens.meta, personality: fresh.tokens.meta.personality } } });
          break;
        case 4:
          handleUpdateActiveProject({ visualDirection: fresh.visualDirection });
          break;
        case 5:
          handleUpdateActiveProject({ colorPalette: fresh.colorPalette, tokens: { ...activeProject.tokens, color: fresh.tokens.color } });
          break;
        case 6:
          handleUpdateActiveProject({ typography: fresh.typography, tokens: { ...activeProject.tokens, typography: fresh.tokens.typography } });
          break;
        case 7:
          handleUpdateActiveProject({ layout: fresh.layout });
          break;
        case 8:
          handleUpdateActiveProject({ components: fresh.components });
          break;
        case 9:
          handleUpdateActiveProject({ imagery: fresh.imagery });
          break;
        default:
          break;
      }
    }
  };

  const handleStartNewProject = () => {
    const newProj = createNewProject('My New Website', 'ceramics-atelier');
    saveProject(newProj);
    refreshProjectsList();
    setActiveId(newProj.id);
    setActiveProjectId(newProj.id);
    setView('wizard');
  };

  const handleSelectProjectFromDashboard = (id: string, continueWizard: boolean = false) => {
    setActiveId(id);
    setActiveProjectId(id);
    if (continueWizard) {
      setView('wizard');
    } else {
      setView('workspace');
    }
  };

  const handleExploreSample = (sample: DesignProject) => {
    const list = getStoredProjects();
    const existing = list.find(p => p.id === sample.id);
    if (!existing) {
      saveProject(sample);
      refreshProjectsList();
    }
    setActiveId(sample.id);
    setActiveProjectId(sample.id);
    setView('workspace');
  };

  // Compute effective project with draft preview overlay
  const effectiveProject: DesignProject = draftProject
    ? {
        ...activeProject,
        ...draftProject,
        tokens: draftProject.tokens ? { ...activeProject.tokens, ...draftProject.tokens } : activeProject.tokens
      }
    : activeProject;

  const renderWizardStep = () => {
    switch (activeProject.currentStep) {
      case 1:
        return (
          <Step1CategoryGenre
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 2:
        return (
          <Step2ProjectBusiness
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 3:
        return (
          <Step3BrandPersonality
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 4:
        return (
          <Step5VisualDirection
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 5:
        return (
          <Step6ColorStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 6:
        return (
          <Step6TypographyStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 7:
        return (
          <Step9LayoutSpacing
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 8:
        return (
          <Step10ComponentsStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 9:
        return (
          <Step8ImageryStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 10:
        return (
          <Step10ReviewAudit
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      case 11:
        return (
          <Step11ExportCenter
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
          />
        );
      default:
        return (
          <Step1CategoryGenre
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      <Header
        currentView={view}
        onNavigate={v => setView(v)}
        activeProject={activeProject}
        onTogglePreviewDrawer={() => setIsPreviewDrawerOpen(!isPreviewDrawerOpen)}
        isPreviewDrawerOpen={isPreviewDrawerOpen}
      />

      {/* Main Content Areas */}
      {view === 'landing' && (
        <LandingPage
          onStartNew={handleStartNewProject}
          onExploreSample={handleExploreSample}
          onImportProject={project => {
            refreshProjectsList();
            setActiveProjectId(project.id);
            setView('workspace');
          }}
        />
      )}

      {view === 'dashboard' && (
        <ProjectDashboard
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProjectFromDashboard}
          onRefreshProjects={refreshProjectsList}
        />
      )}

      {view === 'workspace' && (
        <WorkspaceView
          project={activeProject}
          onEditCategory={step => {
            handleSelectStep(step);
            setView('wizard');
          }}
          onNavigateToWizard={() => setView('wizard')}
        />
      )}

      {view === 'wizard' && (
        <div className="flex-1 flex flex-col">
          <WizardNav
            currentStep={activeProject.currentStep}
            completedSteps={activeProject.completedSteps || [1]}
            onSelectStep={handleSelectStep}
            onNext={handleNextStep}
            onBack={handleBackStep}
            onSkip={handleNextStep}
            onResetStep={handleResetCurrentStep}
            isAutosaving={isAutosaving}
            continueLabel={
              activeProject.currentStep === 10
                ? 'Proceed to Export'
                : activeProject.currentStep === 11
                ? 'Finish'
                : 'Continue'
            }
          />

          <WizardWorkspaceStage
            project={effectiveProject}
            currentStep={activeProject.currentStep}
            totalSteps={11}
            draftLabel={draftLabel}
            onApplyDraft={handleApplyDraft}
            onDiscardDraft={handleClearDraft}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={history.length > 0}
            canRedo={future.length > 0}
          >
            <AnimatePresence mode="wait">
              <StepTransition stepKey={activeProject.currentStep}>
                {renderWizardStep()}
              </StepTransition>
            </AnimatePresence>
          </WizardWorkspaceStage>
        </div>
      )}

      <OAuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStudio />
    </AuthProvider>
  );
}

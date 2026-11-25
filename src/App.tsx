import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Info } from 'lucide-react';
import { Header } from './components/common/Header';
import { WizardNav } from './components/common/WizardNav';
import { StepTransition } from './components/common/StepTransition';
import { StepLoader } from './components/common/StepLoader';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';
import { OAuthModal } from './components/auth/OAuthModal';

// Route-level Code Splitting for Main Views (Doc 03 §Performance)
const LandingPage = lazy(() =>
  import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage }))
);
const ProjectDashboard = lazy(() =>
  import('./components/dashboard/ProjectDashboard').then(m => ({ default: m.ProjectDashboard }))
);
const WorkspaceView = lazy(() =>
  import('./components/workspace/WorkspaceView').then(m => ({ default: m.WorkspaceView }))
);

// 11-Step Modular Wizard Components (Lazy loaded on demand)
const Step1CategoryGenre = lazy(() =>
  import('./components/wizard/Step1CategoryGenre').then(m => ({ default: m.Step1CategoryGenre }))
);
const Step2ProjectBusiness = lazy(() =>
  import('./components/wizard/Step2ProjectBusiness').then(m => ({ default: m.Step2ProjectBusiness }))
);
const Step3BrandPersonality = lazy(() =>
  import('./components/wizard/Step3BrandPersonality').then(m => ({ default: m.Step3BrandPersonality }))
);
const Step5VisualDirection = lazy(() =>
  import('./components/wizard/Step5VisualDirection').then(m => ({ default: m.Step5VisualDirection }))
);
const Step6ColorStudio = lazy(() =>
  import('./components/wizard/Step6ColorStudio').then(m => ({ default: m.Step6ColorStudio }))
);
const Step6TypographyStudio = lazy(() =>
  import('./components/wizard/Step6TypographyStudio').then(m => ({ default: m.Step6TypographyStudio }))
);
const Step9LayoutSpacing = lazy(() =>
  import('./components/wizard/Step9LayoutSpacing').then(m => ({ default: m.Step9LayoutSpacing }))
);
const Step10ComponentsStudio = lazy(() =>
  import('./components/wizard/Step10ComponentsStudio').then(m => ({ default: m.Step10ComponentsStudio }))
);
const Step8ImageryStudio = lazy(() =>
  import('./components/wizard/Step8ImageryStudio').then(m => ({ default: m.Step8ImageryStudio }))
);
const Step10ReviewAudit = lazy(() =>
  import('./components/wizard/Step10ReviewAudit').then(m => ({ default: m.Step10ReviewAudit }))
);
const Step11ExportCenter = lazy(() =>
  import('./components/wizard/Step11ExportCenter').then(m => ({ default: m.Step11ExportCenter }))
);

import { WizardWorkspaceStage } from './components/wizard/WizardWorkspaceStage';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { LegalModal } from './components/common/LegalModal';
import { ConfirmModal } from './components/common/ConfirmModal';

import { DesignProject } from './types/designSystem';
import {
  getStoredProjects,
  saveProject,
  getActiveProjectId,
  setActiveProjectId
} from './utils/storage';
import { createNewProject, SAMPLE_PROJECT_CERAMICS } from './data/sampleProjects';
import { mergeTokens, MAX_HISTORY } from './tokens/tokenReducer';
import {
  subscribeToUserProjects,
  saveProjectToCloud,
  syncLocalProjectsToCloud
} from './services/projectSync';
import { parseHashRoute, formatHashRoute, navigateToRoute, decodeShareableData, StudioView } from './utils/router';
import { DesignTokens } from './tokens/types';
import { SharedProjectPreview } from './components/share/SharedProjectPreview';
import { logger } from './utils/logger';

const VIEW_STORAGE_KEY = 'dss_active_view_v1';

function MainStudio() {
  const { user } = useAuth();
  // Guard against duplicate project creation and cloud-sync clobbering during onboarding.
  const creatingProjectRef = React.useRef(false);
  const justCreatedProjectIdRef = React.useRef<string | null>(null);

  // State: View, Projects, and Active Selection
  const [view, setView] = useState<StudioView>(() => {
    if (typeof window !== 'undefined') {
      const initialRoute = parseHashRoute(window.location.hash);
      if (initialRoute.view !== 'landing') {
        return initialRoute.view;
      }
      const stored = localStorage.getItem(VIEW_STORAGE_KEY) as StudioView | null;
      if (stored === 'wizard' || stored === 'workspace' || stored === 'dashboard' || stored === 'share') {
        return stored;
      }
    }
    return 'landing';
  });

  const [sharedTokens, setSharedTokens] = useState<DesignTokens | null>(() => {
    if (typeof window !== 'undefined') {
      const initialRoute = parseHashRoute(window.location.hash);
      if (initialRoute.view === 'share' && initialRoute.shareData) {
        return decodeShareableData(initialRoute.shareData);
      }
    }
    return null;
  });

  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [activeProjectId, setActiveId] = useState<string>('');
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);

  // Draft preview, A/B compare and undo/redo state (Doc 02 §3.3 & §6)
  const [draftProject, setDraftProject] = useState<Partial<DesignProject> | null>(null);
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<DesignProject[]>([]);
  const [future, setFuture] = useState<DesignProject[]>([]);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; tab: 'terms' | 'privacy' }>({
    isOpen: false,
    tab: 'privacy'
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Auto-dismiss toast message
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle localStorage QuotaExceeded warnings (Doc 03 §Persistence)
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setToastMessage('Storage quota exceeded! Export your projects to JSON and clear older entries.');
    };
    window.addEventListener('dss:storage-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('dss:storage-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Initialize projects on load & parse initial hash route deep links
  useEffect(() => {
    const loadedProjects = getStoredProjects();
    const storedActiveId = getActiveProjectId();
    setProjects(loadedProjects);

    const initialRoute = parseHashRoute(window.location.hash);
    let chosenId = storedActiveId;

    if (initialRoute.projectId && loadedProjects.some(p => p.id === initialRoute.projectId)) {
      chosenId = initialRoute.projectId;
    } else if (!loadedProjects.some(p => p.id === storedActiveId)) {
      chosenId = loadedProjects[0]?.id || SAMPLE_PROJECT_CERAMICS.id;
    }

    setActiveId(chosenId);
    setActiveProjectId(chosenId);

    if (initialRoute.step && chosenId) {
      setProjects(prev =>
        prev.map(p => (p.id === chosenId ? { ...p, currentStep: initialRoute.step! } : p))
      );
    }
  }, []);

  // Sync state on hashchange (Browser Back/Forward buttons and deep links)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHashRoute(window.location.hash);
      setView(route.view);
      try {
        localStorage.setItem(VIEW_STORAGE_KEY, route.view);
      } catch {
        // storage restricted
      }

      if (route.view === 'share' && route.shareData) {
        const decoded = decodeShareableData(route.shareData);
        if (decoded) {
          setSharedTokens(decoded);
        }
      }

      if (route.projectId) {
        setActiveId(route.projectId);
        setActiveProjectId(route.projectId);
      }

      if (route.step) {
        setProjects(prev =>
          prev.map(p =>
            p.id === (route.projectId || activeProjectId) && p.currentStep !== route.step
              ? { ...p, currentStep: route.step! }
              : p
          )
        );
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeProjectId]);

  const activeProject =
    projects.find(p => p.id === activeProjectId) || projects[0] || SAMPLE_PROJECT_CERAMICS;

  // The studio is local-first: the wizard works without an account, matching the
  // documented "zero signup walls" promise. Accounts only add cloud sync.
  const handleSetView = useCallback((nextView: StudioView) => {
    setView(nextView);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    } catch {
      // storage restricted
    }
    navigateToRoute({
      view: nextView,
      projectId: activeProjectId || undefined,
      step: nextView === 'wizard' ? activeProject?.currentStep : undefined
    });
  }, [activeProjectId, activeProject?.currentStep]);

  // Real-time synchronization of projects when logged in with Google or account
  useEffect(() => {
    if (!user) return;

    const currentLocals = getStoredProjects();
    syncLocalProjectsToCloud(user.id, currentLocals).catch(e => {
      logger.warn('Initial cloud sync notice:', e);
    });

    const unsubscribe = subscribeToUserProjects(
      user.id,
      (cloudProjects) => {
        if (cloudProjects.length > 0) {
          setProjects(prev => {
            const map = new Map<string, DesignProject>();
            prev.forEach(p => map.set(p.id, p));
            cloudProjects.forEach(cp => {
              const local = map.get(cp.id);
              if (!local || (cp.updatedAt || 0) > (local.updatedAt || 0)) {
                map.set(cp.id, cp);
                saveProject(cp, 0, { makeActive: false });
              }
            });
            return Array.from(map.values()).sort(
              (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
            );
          });

          // Reflect the user's newest work, but never steal selection from a project
          // that was just created locally.
          setActiveId(curr => {
            if (justCreatedProjectIdRef.current) return curr;
            if (!curr || curr === SAMPLE_PROJECT_CERAMICS.id) {
              const newest = cloudProjects[0];
              if (newest) {
                setActiveProjectId(newest.id);
                return newest.id;
              }
            }
            return curr;
          });
        }
      },
      (err) => {
        logger.warn('Real-time project listener warning:', err);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  const refreshProjectsList = useCallback(() => {
    const list = getStoredProjects();
    setProjects(list);
  }, []);

  const autosaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update active project with autosave and real-time cloud sync (pure state updater + external side-effects)
  const handleUpdateActiveProject = useCallback((updates: Partial<DesignProject>) => {
    setIsAutosaving(true);
    setDraftProject(null);
    setDraftLabel(null);

    const current = projects.find(p => p.id === activeProject.id) || activeProject;
    const nextTokens = updates.tokens
      ? mergeTokens(current.tokens, updates.tokens)
      : current.tokens;

    const next: DesignProject = {
      ...current,
      ...updates,
      tokens: nextTokens,
      updatedAt: Date.now()
    };

    setHistory(h => [...h.slice(-(MAX_HISTORY - 1)), current]);
    setFuture([]);
    setProjects(prev => prev.map(p => (p.id === next.id ? next : p)));

    saveProject(next);
    if (user) {
      saveProjectToCloud(user.id, next).catch(e => {
        logger.warn('Cloud autosave note:', e);
      });
    }

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      setIsAutosaving(false);
    }, 400);
  }, [projects, activeProject, user]);

  // Draft Preview Handlers
  const handlePreviewDraft = useCallback((draft: Partial<DesignProject>, label: string) => {
    setDraftProject(draft);
    setDraftLabel(label);
    setIsComparing(false);
  }, []);

  const handleClearDraft = useCallback(() => {
    setDraftProject(null);
    setDraftLabel(null);
    setIsComparing(false);
  }, []);

  const handleToggleCompare = useCallback(() => {
    if (draftProject) {
      setIsComparing(prev => {
        const next = !prev;
        setToastMessage(next ? 'Comparing: Showing Original (A) — press C to toggle' : 'Comparing: Showing Preview (B) — press C to toggle');
        return next;
      });
    }
  }, [draftProject]);

  const handleApplyDraft = useCallback(() => {
    if (draftProject) {
      handleUpdateActiveProject(draftProject);
      setToastMessage(`Applied: ${draftLabel || 'Preview preset'}`);
      setDraftProject(null);
      setDraftLabel(null);
      setIsComparing(false);
    }
  }, [draftProject, draftLabel, handleUpdateActiveProject]);

  // Undo / Redo Handlers
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setFuture(f => [activeProject, ...f]);
      setHistory(h => h.slice(0, h.length - 1));
      saveProject(prev);
      setProjects(list => list.map(p => p.id === prev.id ? prev : p));
      setToastMessage('Undone last action');
    }
  }, [history, activeProject]);

  const handleRedo = useCallback(() => {
    if (future.length > 0) {
      const next = future[0];
      setHistory(h => [...h, activeProject]);
      setFuture(f => f.slice(1));
      saveProject(next);
      setProjects(list => list.map(p => p.id === next.id ? next : p));
      setToastMessage('Redone action');
    }
  }, [future, activeProject]);

  // Step Navigation handlers
  const canContinue = React.useMemo(() => {
    if (activeProject.currentStep === 1) {
      return Boolean(activeProject.websiteType?.id || activeProject.tokens?.meta?.genreId);
    }
    if (activeProject.currentStep === 2) {
      return Boolean(activeProject.name && activeProject.name.trim().length > 0);
    }
    return true;
  }, [activeProject.currentStep, activeProject.websiteType?.id, activeProject.tokens?.meta?.genreId, activeProject.name]);

  const handleNextStep = useCallback(() => {
    if (!canContinue) {
      setToastMessage('Please complete required fields to continue');
      return;
    }
    if (draftProject) {
      setToastMessage('Preview draft discarded — preset restored');
    }
    handleClearDraft();
    if (activeProject.currentStep < 11) {
      const nextStep = activeProject.currentStep + 1;
      const completed = Array.from(new Set([...activeProject.completedSteps, activeProject.currentStep]));
      handleUpdateActiveProject({
        currentStep: nextStep,
        completedSteps: completed
      });
      navigateToRoute({
        view: 'wizard',
        projectId: activeProject.id,
        step: nextStep
      });
    } else {
      handleSetView('workspace');
    }
  }, [canContinue, draftProject, handleClearDraft, activeProject.currentStep, activeProject.completedSteps, activeProject.id, handleUpdateActiveProject, handleSetView]);

  const handleSkipStep = useCallback(() => {
    if (draftProject) {
      setToastMessage('Preview draft discarded — preset restored');
    }
    handleClearDraft();
    if (activeProject.currentStep < 11) {
      const nextStep = activeProject.currentStep + 1;
      // Do not mark skipped step as completed
      handleUpdateActiveProject({
        currentStep: nextStep
      });
      navigateToRoute({
        view: 'wizard',
        projectId: activeProject.id,
        step: nextStep
      });
    } else {
      handleSetView('workspace');
    }
  }, [draftProject, handleClearDraft, activeProject.currentStep, activeProject.id, handleUpdateActiveProject, handleSetView]);

  const handleBackStep = useCallback(() => {
    if (draftProject) {
      setToastMessage('Preview draft discarded — preset restored');
    }
    handleClearDraft();
    if (activeProject.currentStep > 1) {
      const prevStep = activeProject.currentStep - 1;
      handleUpdateActiveProject({
        currentStep: prevStep
      });
      navigateToRoute({
        view: 'wizard',
        projectId: activeProject.id,
        step: prevStep
      });
    }
  }, [draftProject, handleClearDraft, activeProject.currentStep, activeProject.id, handleUpdateActiveProject]);

  const handleSelectStep = useCallback((stepNumber: number) => {
    if (draftProject) {
      setToastMessage('Preview draft discarded — preset restored');
    }
    handleClearDraft();
    handleUpdateActiveProject({
      currentStep: stepNumber
    });
    navigateToRoute({
      view: 'wizard',
      projectId: activeProject.id,
      step: stepNumber
    });
  }, [draftProject, handleClearDraft, handleUpdateActiveProject, activeProject.id]);

  // Global Keyboard Shortcuts (← / → steps, Cmd+Z undo, Cmd+Shift+Z redo, C compare, ? help)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'slider' ||
          target.getAttribute('role') === 'tab' ||
          target.getAttribute('role') === 'radio' ||
          target.getAttribute('role') === 'radiogroup' ||
          target.closest('[role="slider"]') !== null ||
          target.closest('[role="tab"]') !== null ||
          target.closest('[role="radiogroup"]') !== null ||
          target.closest('.color-wheel') !== null ||
          target.closest('[data-color-wheel]') !== null ||
          (target as HTMLInputElement).type === 'range');

      // ? or Shift+/ opens shortcuts modal
      if ((e.key === '?' || (e.shiftKey && e.key === '/')) && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // Cmd/Ctrl + Z (Undo)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Cmd/Ctrl + Shift + Z or Ctrl + Y (Redo)
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Navigation shortcuts in wizard mode
      if (!isInput && view === 'wizard') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextStep();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleBackStep();
        } else if (e.key.toLowerCase() === 'c' && draftProject) {
          e.preventDefault();
          handleToggleCompare();
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('dss:toggle-mode'));
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [view, draftProject, handleUndo, handleRedo, handleNextStep, handleBackStep, handleToggleCompare]);

  const handleResetCurrentStep = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmResetStep = () => {
    setIsResetConfirmOpen(false);
    const fresh = createNewProject(activeProject.name, activeProject.websiteType?.id || 'ecommerce');
    switch (activeProject.currentStep) {
      case 1:
        handleUpdateActiveProject({
          websiteType: fresh.websiteType,
          tokens: {
            ...activeProject.tokens,
            meta: {
              ...activeProject.tokens.meta,
              category: fresh.tokens.meta.category,
              genreId: fresh.tokens.meta.genreId
            }
          }
        });
        break;
      case 2:
        handleUpdateActiveProject({
          business: fresh.business,
          tokens: {
            ...activeProject.tokens,
            meta: {
              ...activeProject.tokens.meta,
              description: fresh.tokens.meta.description,
              goal: fresh.tokens.meta.goal,
              audience: fresh.tokens.meta.audience,
              inspirationUrls: []
            }
          }
        });
        break;
      case 3:
        handleUpdateActiveProject({
          brandPersonality: fresh.brandPersonality,
          tokens: { ...activeProject.tokens, meta: { ...activeProject.tokens.meta, personality: fresh.tokens.meta.personality } }
        });
        break;
      case 4:
        handleUpdateActiveProject({ visualDirection: fresh.visualDirection });
        break;
      case 5:
        handleUpdateActiveProject({
          colorPalette: fresh.colorPalette,
          tokens: { ...activeProject.tokens, color: fresh.tokens.color }
        });
        break;
      case 6:
        handleUpdateActiveProject({
          typography: fresh.typography,
          tokens: { ...activeProject.tokens, typography: fresh.tokens.typography }
        });
        break;
      case 7:
        handleUpdateActiveProject({
          layout: fresh.layout,
          tokens: {
            ...activeProject.tokens,
            space: fresh.tokens.space,
            radius: fresh.tokens.radius,
            shadow: fresh.tokens.shadow
          }
        });
        break;
      case 8:
        handleUpdateActiveProject({
          components: fresh.components,
          tokens: { ...activeProject.tokens, component: fresh.tokens.component }
        });
        break;
      case 9:
        handleUpdateActiveProject({
          imagery: fresh.imagery,
          tokens: {
            ...activeProject.tokens,
            motion: fresh.tokens.motion,
            imagery: fresh.tokens.imagery,
            icon: fresh.tokens.icon
          }
        });
        break;
      case 10:
        handleUpdateActiveProject({
          accessibility: fresh.accessibility
        });
        break;
      case 11:
        setToastMessage('Export options reset to standard defaults');
        return;
      default:
        break;
    }
    setToastMessage(`Step ${activeProject.currentStep} restored to recommended defaults`);
  };

  const handleStartNewProject = useCallback(() => {
    if (creatingProjectRef.current) return;
    creatingProjectRef.current = true;

    setHistory([]);
    setFuture([]);
    const newProj = createNewProject('My New Website', 'ecommerce');
    newProj.currentStep = 1;
    newProj.completedSteps = [];
    justCreatedProjectIdRef.current = newProj.id;

    // Persist synchronously before refreshing the list and selecting the project —
    // the previous debounced write meant the new project wasn't in state yet and the
    // wizard silently fell back to the sample project.
    saveProject(newProj, 0, { makeActive: true });
    const refreshed = getStoredProjects();
    setProjects(refreshed);
    setActiveId(newProj.id);
    setActiveProjectId(newProj.id);
    setView('wizard');
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, 'wizard');
    } catch {
      // storage restricted
    }
    navigateToRoute({ view: 'wizard', projectId: newProj.id, step: 1 });

    if (user?.id) {
      saveProjectToCloud(user.id, newProj).catch(e => logger.warn('Cloud save notice:', e));
    }

    // Release the guard after the cloud-sync subscription has had a chance to run.
    setTimeout(() => {
      justCreatedProjectIdRef.current = null;
      creatingProjectRef.current = false;
    }, 1000);
  }, [user]);

  const handleSelectProjectFromDashboard = (id: string, continueWizard: boolean = false) => {
    setHistory([]);
    setFuture([]);
    setActiveId(id);
    setActiveProjectId(id);
    const proj = projects.find(p => p.id === id);
    const targetView: StudioView = continueWizard ? 'wizard' : 'workspace';
    setView(targetView);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, targetView);
    } catch {
      // storage restricted
    }
    navigateToRoute({
      view: targetView,
      projectId: id,
      step: continueWizard ? (proj?.currentStep || 1) : undefined
    });
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
    handleSetView('workspace');
  };

  // Compute effective project with draft preview overlay (or original committed state when actively comparing A/B)
  const effectiveProject: DesignProject = (draftProject && !isComparing)
    ? {
      ...activeProject,
      ...draftProject,
      tokens: draftProject.tokens ? mergeTokens(activeProject.tokens, draftProject.tokens) : activeProject.tokens
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
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 5:
        return (
          <Step6ColorStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
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
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 8:
        return (
          <Step10ComponentsStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
          />
        );
      case 9:
        return (
          <Step8ImageryStudio
            project={effectiveProject}
            onChange={handleUpdateActiveProject}
            onPreviewDraft={handlePreviewDraft}
            onClearDraft={handleClearDraft}
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
      {/* Accessible Skip Link (WCAG 2.2 SC 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-amber-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-neutral-900"
      >
        Skip to main content
      </a>

      <Header
        currentView={view}
        onNavigate={v => handleSetView(v)}
        activeProject={activeProject}
        onTogglePreviewDrawer={() => setIsPreviewDrawerOpen(!isPreviewDrawerOpen)}
        isPreviewDrawerOpen={isPreviewDrawerOpen}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        projectsCount={projects.length}
        onStartNewDesign={handleStartNewProject}
      />

      {/* Main Content Area Landmark (WCAG 2.2 SC 1.3.1 & 2.4.1) */}
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none" role="main">
        {/* Main Content Areas with Suspense Code-Splitting */}
        <Suspense fallback={<StepLoader label="Loading view..." />}>
          {view === 'landing' && (
            <LandingPage
              onStartNew={handleStartNewProject}
              onExploreSample={handleExploreSample}
              onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab })}
              onImportProject={project => {
                refreshProjectsList();
                setActiveProjectId(project.id);
                handleSetView('workspace');
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
                handleSetView('wizard');
              }}
              onNavigateToWizard={() => handleSetView('wizard')}
            />
          )}

          {view === 'share' && sharedTokens && (
            <SharedProjectPreview
              tokens={sharedTokens}
              onForkAndEdit={() => {
                const newProject = createNewProject(sharedTokens.meta.projectName || 'Shared System');
                newProject.tokens = sharedTokens;
                newProject.name = sharedTokens.meta.projectName || 'Shared System';
                saveProject(newProject);
                refreshProjectsList();
                setActiveProjectId(newProject.id);
                setActiveId(newProject.id);
                handleSetView('workspace');
              }}
            />
          )}
        </Suspense>

        {view === 'wizard' && (
          <div className="flex-1 flex flex-col">
            <WizardNav
              currentStep={activeProject.currentStep}
              completedSteps={activeProject.completedSteps || [1]}
              onSelectStep={handleSelectStep}
              onNext={handleNextStep}
              onBack={handleBackStep}
              onSkip={handleSkipStep}
              onResetStep={handleResetCurrentStep}
              canContinue={canContinue}
              isAutosaving={isAutosaving}
              lastSavedAt={activeProject.updatedAt}
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
              onToggleCompare={handleToggleCompare}
              isComparing={isComparing}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={history.length > 0}
              canRedo={future.length > 0}
            >
              <AnimatePresence mode="wait">
                <StepTransition stepKey={activeProject.currentStep}>
                  <Suspense fallback={<StepLoader label={`Loading Step ${activeProject.currentStep}...`} />}>
                    {renderWizardStep()}
                  </Suspense>
                </StepTransition>
              </AnimatePresence>
            </WizardWorkspaceStage>
          </div>
        )}
      </main>

      <OAuthModal />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <LegalModal
        isOpen={legalModal.isOpen}
        initialTab={legalModal.tab}
        onClose={() => setLegalModal(prev => ({ ...prev, isOpen: false }))}
      />
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title={`Reset Step ${activeProject.currentStep}?`}
        description="This will restore all configuration and tokens for this step back to recommended design system defaults. Your work in other steps will remain preserved."
        confirmLabel="Reset to Defaults"
        cancelLabel="Keep Changes"
        variant="warning"
        onConfirm={handleConfirmResetStep}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Floating Status & Preview Toast (Doc 02 §3.3 & Doc 04 §Accessibility) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-2xl border border-neutral-700/60 backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
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

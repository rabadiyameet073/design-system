import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/common/Header';
import { WizardNav } from './components/common/WizardNav';
import { LandingPage } from './components/landing/LandingPage';
import { ProjectDashboard } from './components/dashboard/ProjectDashboard';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { LiveWebsitePreview } from './components/preview/LiveWebsitePreview';
import { StepTransition } from './components/common/StepTransition';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth-context';
import { OAuthModal } from './components/auth/OAuthModal';

// Step components
import { Step1ProjectInit } from './components/wizard/Step1ProjectInit';
import { Step2WebsiteType } from './components/wizard/Step2WebsiteType';
import { Step3BusinessDiscovery } from './components/wizard/Step3BusinessDiscovery';
import { Step4BrandPersonality } from './components/wizard/Step4BrandPersonality';
import { Step5VisualDirection } from './components/wizard/Step5VisualDirection';
import { Step6ColorStudio } from './components/wizard/Step6ColorStudio';
import { Step7TypographyStudio } from './components/wizard/Step7TypographyStudio';
import { Step8ImageryStudio } from './components/wizard/Step8ImageryStudio';
import { Step9LayoutSpacing } from './components/wizard/Step9LayoutSpacing';
import { Step10ComponentsStudio } from './components/wizard/Step10ComponentsStudio';
import { Step11MobileResponsive } from './components/wizard/Step11MobileResponsive';
import { Step12ThemesAccessibility } from './components/wizard/Step12ThemesAccessibility';
import { Step13FinalReview } from './components/wizard/Step13FinalReview';
import { Step14ExportCenter } from './components/wizard/Step14ExportCenter';

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

    // Sync local projects to cloud on sign-in
    const currentLocals = getStoredProjects();
    syncLocalProjectsToCloud(user.id, currentLocals).catch(e => {
      console.warn('Initial cloud sync notice:', e);
    });

    // Subscribe to real-time changes across tabs & cloud store
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

  // Step Navigation handlers
  const handleNextStep = () => {
    if (activeProject.currentStep < 14) {
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
    if (activeProject.currentStep > 1) {
      handleUpdateActiveProject({
        currentStep: activeProject.currentStep - 1
      });
    }
  };

  const handleSelectStep = (stepNumber: number) => {
    handleUpdateActiveProject({
      currentStep: stepNumber
    });
  };

  const handleResetCurrentStep = () => {
    if (window.confirm('Reset this step to recommended defaults?')) {
      const fresh = createNewProject(activeProject.name, activeProject.websiteType.id);
      // Reset only fields belonging to current step
      switch (activeProject.currentStep) {
        case 4:
          handleUpdateActiveProject({ brandPersonality: fresh.brandPersonality });
          break;
        case 5:
          handleUpdateActiveProject({ visualDirection: fresh.visualDirection });
          break;
        case 6:
          handleUpdateActiveProject({ colorPalette: fresh.colorPalette });
          break;
        case 7:
          handleUpdateActiveProject({ typography: fresh.typography });
          break;
        case 8:
          handleUpdateActiveProject({ imagery: fresh.imagery });
          break;
        case 9:
          handleUpdateActiveProject({ layout: fresh.layout });
          break;
        case 10:
          handleUpdateActiveProject({ components: fresh.components });
          break;
        case 11:
          handleUpdateActiveProject({ responsive: fresh.responsive });
          break;
        case 12:
          handleUpdateActiveProject({ accessibility: fresh.accessibility });
          break;
        default:
          break;
      }
    }
  };

  const handleStartNewProject = () => {
    const newProj = createNewProject('My New Website', 'ecommerce');
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

  const renderWizardStep = () => {
    switch (activeProject.currentStep) {
      case 1:
        return <Step1ProjectInit project={activeProject} onChange={handleUpdateActiveProject} />;
      case 2:
        return <Step2WebsiteType project={activeProject} onChange={handleUpdateActiveProject} />;
      case 3:
        return <Step3BusinessDiscovery project={activeProject} onChange={handleUpdateActiveProject} />;
      case 4:
        return <Step4BrandPersonality project={activeProject} onChange={handleUpdateActiveProject} />;
      case 5:
        return <Step5VisualDirection project={activeProject} onChange={handleUpdateActiveProject} />;
      case 6:
        return <Step6ColorStudio project={activeProject} onChange={handleUpdateActiveProject} />;
      case 7:
        return <Step7TypographyStudio project={activeProject} onChange={handleUpdateActiveProject} />;
      case 8:
        return <Step8ImageryStudio project={activeProject} onChange={handleUpdateActiveProject} />;
      case 9:
        return <Step9LayoutSpacing project={activeProject} onChange={handleUpdateActiveProject} />;
      case 10:
        return <Step10ComponentsStudio project={activeProject} onChange={handleUpdateActiveProject} />;
      case 11:
        return (
          <Step11MobileResponsive
            project={activeProject}
            onChange={handleUpdateActiveProject}
            onOpenLivePreview={() => setIsPreviewDrawerOpen(true)}
          />
        );
      case 12:
        return <Step12ThemesAccessibility project={activeProject} onChange={handleUpdateActiveProject} />;
      case 13:
        return (
          <Step13FinalReview
            project={activeProject}
            onJumpToStep={handleSelectStep}
            onProceedToExport={() => handleSelectStep(14)}
          />
        );
      case 14:
        return <Step14ExportCenter project={activeProject} onJumpToStep={handleSelectStep} />;
      default:
        return <Step1ProjectInit project={activeProject} onChange={handleUpdateActiveProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      {/* 3-Zone Contract Header with OAuth 2.0 Identity Status */}
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
          {/* Multi-step progress navbar */}
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
              activeProject.currentStep === 13
                ? 'Proceed to Export'
                : activeProject.currentStep === 14
                ? 'Finished'
                : 'Continue'
            }
          />

          {/* Wizard stage: Split screen when Preview Drawer is toggled, or single focused stage */}
          <div className="flex-1 flex overflow-hidden">
            {/* Step Decision Form with smooth page transitions */}
            <main className="flex-1 overflow-y-auto px-6 pb-20">
              <AnimatePresence mode="wait">
                <StepTransition stepKey={activeProject.currentStep}>
                  {renderWizardStep()}
                </StepTransition>
              </AnimatePresence>
            </main>

            {/* Collapsible Split Live Preview Drawer with slide motion */}
            <AnimatePresence>
              {isPreviewDrawerOpen && (
                <motion.aside
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[480px] xl:w-[560px] border-l border-neutral-200 bg-neutral-900 p-4 shrink-0 hidden md:flex flex-col shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-800">
                    <span className="text-xs font-bold text-neutral-300">Live Website Preview</span>
                    <button
                      onClick={() => setIsPreviewDrawerOpen(false)}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 min-h-[500px]">
                    <LiveWebsitePreview project={activeProject} initialViewport="desktop" isEmbedded />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* OAuth 2.0 Sign-In Modal */}
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

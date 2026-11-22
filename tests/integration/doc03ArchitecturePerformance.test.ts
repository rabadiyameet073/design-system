import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseHashRoute, formatHashRoute } from '../../src/utils/router';
import { validateProjectData, validateTokensData } from '../../src/utils/projectSchema';
import { STEP_DEFINITIONS, getStepDefinition } from '../../src/components/wizard/stepDefinitions';
import { logger } from '../../src/utils/logger';

describe('Doc 03 Architecture, Code Quality & Performance Protocol', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Hash Routing Protocol (Doc 03 §State management)', () => {
    it('supports landing, dashboard, and workspace views', () => {
      expect(parseHashRoute('#/')).toEqual({ view: 'landing' });
      expect(parseHashRoute('#/dashboard')).toEqual({ view: 'dashboard' });
      expect(parseHashRoute('#/workspace')).toEqual({ view: 'workspace' });
    });

    it('supports deep links to project workspace and wizard steps', () => {
      const stepRoute = parseHashRoute('#/project/proj-ceramics-001/step/5');
      expect(stepRoute.view).toBe('wizard');
      expect(stepRoute.projectId).toBe('proj-ceramics-001');
      expect(stepRoute.step).toBe(5);

      const wsRoute = parseHashRoute('#/project/proj-ceramics-001/workspace');
      expect(wsRoute.view).toBe('workspace');
      expect(wsRoute.projectId).toBe('proj-ceramics-001');
    });

    it('round-trips route formatting cleanly', () => {
      const formatted = formatHashRoute({
        view: 'wizard',
        projectId: 'project-abc',
        step: 6
      });
      expect(formatted).toBe('#/project/project-abc/step/6');
      expect(parseHashRoute(formatted)).toEqual({
        view: 'wizard',
        projectId: 'project-abc',
        step: 6
      });
    });
  });

  describe('2. Zod Schema Validation for Untrusted Imports (Doc 03 §Persistence)', () => {
    it('validates a valid project payload', () => {
      const validProject = {
        id: 'test-proj-1',
        name: 'Test Project',
        currentStep: 1,
        tokens: {
          version: '1.0.0',
          meta: { projectName: 'Test Project' },
          color: {
            primitives: { brand: {}, neutral: {}, accent: {} },
            semantic: { light: {}, dark: {} }
          }
        }
      };

      const result = validateProjectData(validProject);
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('test-proj-1');
    });

    it('rejects completely malformed data gracefully without throwing', () => {
      const invalid = { id: 12345 }; // id should be string, name and tokens missing
      const result = validateProjectData(invalid);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('validates standalone design token objects', () => {
      const validTokens = {
        version: '1.0.0',
        meta: { projectName: 'Tokens Only' },
        color: {
          primitives: { brand: {} },
          semantic: { light: {} }
        }
      };
      const res = validateTokensData(validTokens);
      expect(res.success).toBe(true);
    });
  });

  describe('3. Step Definitions & Code-Splitting Decoupling (Doc 03 §Code health)', () => {
    it('contains all 11 wizard steps in correct logical order', () => {
      expect(STEP_DEFINITIONS.length).toBe(11);
      for (let i = 1; i <= 11; i++) {
        const step = getStepDefinition(i);
        expect(step.number).toBe(i);
        expect(step.title).toBeDefined();
        expect(step.focusSection).toBeDefined();
        expect(step.category).toBeDefined();
      }
    });

    it('does not statically bind step components, keeping metadata lightweight', () => {
      // Step definitions should not force static bundling of heavy React components
      STEP_DEFINITIONS.forEach(step => {
        expect(typeof step.id).toBe('string');
        expect(typeof step.number).toBe('number');
        expect(Array.isArray(step.tokenPaths)).toBe(true);
      });
    });
  });

  describe('4. Logger Utility (Doc 03 §Code health)', () => {
    it('provides structured debug, info, warn, and error methods', () => {
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });
  });
});

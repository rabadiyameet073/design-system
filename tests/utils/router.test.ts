import { describe, it, expect } from 'vitest';
import { parseHashRoute, formatHashRoute, RouteState } from '../../src/utils/router';

describe('Router Hash Routing Protocol (Doc 03 §State management)', () => {
  it('parses empty and root hash as landing view', () => {
    expect(parseHashRoute('')).toEqual({ view: 'landing' });
    expect(parseHashRoute('#')).toEqual({ view: 'landing' });
    expect(parseHashRoute('#/')).toEqual({ view: 'landing' });
    expect(parseHashRoute('#/landing')).toEqual({ view: 'landing' });
  });

  it('parses dashboard and workspace top-level routes', () => {
    expect(parseHashRoute('#/dashboard')).toEqual({ view: 'dashboard' });
    expect(parseHashRoute('#/workspace')).toEqual({ view: 'workspace' });
    expect(parseHashRoute('#/wizard')).toEqual({ view: 'wizard' });
  });

  it('parses wizard step routes with step numbers', () => {
    expect(parseHashRoute('#/wizard/5')).toEqual({ view: 'wizard', step: 5 });
    expect(parseHashRoute('#/wizard/11')).toEqual({ view: 'wizard', step: 11 });
    expect(parseHashRoute('#/wizard/99')).toEqual({ view: 'wizard', step: 1 }); // clamped
  });

  it('parses project deep link routes', () => {
    expect(parseHashRoute('#/project/proj-123/workspace')).toEqual({
      view: 'workspace',
      projectId: 'proj-123'
    });

    expect(parseHashRoute('#/project/proj-123/step/6')).toEqual({
      view: 'wizard',
      projectId: 'proj-123',
      step: 6
    });

    expect(parseHashRoute('#/project/proj-123/wizard/4')).toEqual({
      view: 'wizard',
      projectId: 'proj-123',
      step: 4
    });
  });

  it('formats RouteState back into clean, canonical hash URLs', () => {
    expect(formatHashRoute({ view: 'landing' })).toBe('#/');
    expect(formatHashRoute({ view: 'dashboard' })).toBe('#/dashboard');
    expect(formatHashRoute({ view: 'workspace', projectId: 'sample-p1' })).toBe('#/project/sample-p1/workspace');
    expect(formatHashRoute({ view: 'wizard', projectId: 'sample-p1', step: 5 })).toBe('#/project/sample-p1/step/5');
  });
});

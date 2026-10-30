import { describe, it, expect } from 'vitest';
import { tokenReducer, getEffectiveTokens, WizardTokenState } from '../../src/tokens/tokenReducer';
import { createDefaultTokens } from '../../src/tokens/defaultTokens';

describe('Token Reducer & History Stack', () => {
  const initialTokens = createDefaultTokens('commerce', 'ecommerce', 'Initial Brand');
  const baseState: WizardTokenState = {
    committed: initialTokens,
    draft: null,
    history: [],
    future: [],
    activeMode: 'light',
    viewport: 'desktop'
  };

  it('sets a draft without mutating committed state', () => {
    const updatedState = tokenReducer(baseState, {
      type: 'PREVIEW_DRAFT',
      draft: {
        radius: { ...initialTokens.radius, md: 16 }
      }
    });

    expect(updatedState.draft).not.toBeNull();
    expect(updatedState.committed.radius.md).toBe(8);

    const effective = getEffectiveTokens(updatedState);
    expect(effective.radius.md).toBe(16);
  });

  it('applies draft to committed state and records history', () => {
    const previewedState = tokenReducer(baseState, {
      type: 'PREVIEW_DRAFT',
      draft: {
        radius: { ...initialTokens.radius, md: 24 }
      }
    });

    const committedState = tokenReducer(previewedState, { type: 'APPLY_DRAFT' });

    expect(committedState.draft).toBeNull();
    expect(committedState.committed.radius.md).toBe(24);
    expect(committedState.history.length).toBe(1);
    expect(committedState.history[0].radius.md).toBe(8);
  });

  it('handles UNDO and REDO accurately', () => {
    const previewedState = tokenReducer(baseState, {
      type: 'PREVIEW_DRAFT',
      draft: {
        radius: { ...initialTokens.radius, md: 32 }
      }
    });
    const stateV1 = tokenReducer(previewedState, { type: 'APPLY_DRAFT' });
    expect(stateV1.committed.radius.md).toBe(32);

    // Undo back to 8px
    const stateUndo = tokenReducer(stateV1, { type: 'UNDO' });
    expect(stateUndo.committed.radius.md).toBe(8);
    expect(stateUndo.future.length).toBe(1);

    // Redo back to 32px
    const stateRedo = tokenReducer(stateUndo, { type: 'REDO' });
    expect(stateRedo.committed.radius.md).toBe(32);
    expect(stateRedo.future.length).toBe(0);
  });
});

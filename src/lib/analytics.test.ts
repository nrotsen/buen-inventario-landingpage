import { describe, it, expect, vi, beforeEach } from 'vitest';
import { track, configureAnalyticsSink } from './analytics';

describe('analytics', () => {
  beforeEach(() => configureAnalyticsSink(null));

  it('envía el evento al sink con sus props', () => {
    const sink = vi.fn();
    configureAnalyticsSink(sink);
    track('demo_started', { chapter: 'vender' });
    expect(sink).toHaveBeenCalledWith('demo_started', { chapter: 'vender' });
  });

  it('no explota si no hay sink configurado', () => {
    expect(() => track('cta_signup_clicked', { section: 'hero' })).not.toThrow();
  });

  it('nunca propaga un error del sink', () => {
    configureAnalyticsSink(() => { throw new Error('proveedor caído'); });
    expect(() => track('demo_started')).not.toThrow();
  });
});

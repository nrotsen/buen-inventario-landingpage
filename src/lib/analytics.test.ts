import { describe, it, expect, vi, beforeEach } from 'vitest';
import { track, __setSink, __resetSink } from './analytics';

describe('analytics', () => {
  beforeEach(() => __resetSink());

  it('envía el evento al sink con sus props', () => {
    const sink = vi.fn();
    __setSink(sink);
    track('demo_started', { chapter: 'vender' });
    expect(sink).toHaveBeenCalledWith('demo_started', { chapter: 'vender' });
  });

  it('no explota si no hay sink configurado', () => {
    expect(() => track('cta_signup_clicked', { section: 'hero' })).not.toThrow();
  });

  it('nunca propaga un error del sink', () => {
    __setSink(() => { throw new Error('proveedor caído'); });
    expect(() => track('demo_started')).not.toThrow();
  });
});

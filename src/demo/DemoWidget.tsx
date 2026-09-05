import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { ChapterVender } from './chapters/ChapterVender';
import { ChapterFiar } from './chapters/ChapterFiar';
import { ChapterCerrar } from './chapters/ChapterCerrar';

const CHAPTERS = [
  { id: 1, num: '01', title: 'Vendés' },
  { id: 2, num: '02', title: 'Fiás' },
  { id: 3, num: '03', title: 'Cerrás' },
] as const;

export function DemoWidget() {
  const [active, setActive] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = useCallback((id: number) => {
    setActive(id);
    track('demo_chapter_viewed', { chapter: id });
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = ((active - 1 + delta + CHAPTERS.length) % CHAPTERS.length) + 1;
    go(next);
    tabRefs.current[next - 1]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-[3px] border-hard border-ink bg-surface shadow-offset-lg">
      <div className="flex items-center gap-2.5 border-b-hard border-ink bg-cream px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className="block size-2.5 rounded-full border border-ink" />)}
        </span>
        <span className="flex-1 truncate text-center font-mono text-[11px] text-text-muted">
          bueninventario.com/demo
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-teal-700">
          <span className="size-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden="true" />
          En vivo
        </span>
      </div>

      <div role="tablist" aria-label="Capítulos del demo" onKeyDown={onKeyDown} className="flex border-b-hard border-ink bg-paper">
        {CHAPTERS.map((c, i) => {
          const selected = active === c.id;
          return (
            <button
              key={c.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`demo-tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`demo-panel-${c.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => go(c.id)}
              className={cn(
                'min-h-[48px] flex-1 border-r border-border-subtle px-2 py-3 text-center transition-colors last:border-r-0',
                'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700',
                selected ? 'bg-ink' : 'hover:bg-teal-50',
              )}
            >
              <span className={cn('block font-mono text-[10px] tracking-[0.1em]', selected ? 'text-teal-500' : 'text-text-muted')}>
                {c.num}
              </span>
              <span className={cn('mt-0.5 block text-body-sm font-medium', selected && 'text-paper')}>
                {c.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Los tres se mantienen montados: cambiar de capítulo no pierde el estado de los otros. */}
      <div role="tabpanel" id="demo-panel-1" aria-labelledby="demo-tab-1" hidden={active !== 1}>
        <ChapterVender onGoToFiar={() => go(2)} />
      </div>
      <div role="tabpanel" id="demo-panel-2" aria-labelledby="demo-tab-2" hidden={active !== 2}>
        <ChapterFiar />
      </div>
      <div role="tabpanel" id="demo-panel-3" aria-labelledby="demo-tab-3" hidden={active !== 3}>
        <ChapterCerrar />
      </div>
    </div>
  );
}

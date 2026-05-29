import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BrowserFrameProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

function splitUrl(url: string): { host: string; path: string } {
  const idx = url.indexOf('/');
  if (idx === -1) return { host: url, path: '' };
  return { host: url.slice(0, idx), path: url.slice(idx) };
}

export function BrowserFrame({ url, children, className }: BrowserFrameProps) {
  const { host, path } = splitUrl(url);
  return (
    <div className={cn('pr-2 pb-2', className)}>
      <div
        className={cn(
          'bg-surface border-hard border-ink rounded-md overflow-hidden',
          'shadow-offset-lg transition-[transform,box-shadow] duration-300 ease-editorial',
          'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#14b8a6]'
        )}
      >
        <div className="flex items-center gap-3 px-3.5 py-2.5 border-b-[1.5px] border-ink bg-cream">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
            <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
            <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
          </div>
          <div className="flex-1 bg-surface border border-ink rounded-sm px-2.5 py-1 font-mono text-[11px] text-text-muted">
            {host}<span className="text-ink font-medium">{path}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PhotoFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PhotoFrame({ children, className }: PhotoFrameProps) {
  return (
    <div className={cn('pr-1.5 pb-1.5 max-w-[380px]', className)}>
      <div
        className={cn(
          'aspect-[4/5] bg-surface border-hard border-ink rounded-md',
          'shadow-offset-md overflow-hidden',
          'flex items-end justify-center relative'
        )}
      >
        {children}
      </div>
    </div>
  );
}

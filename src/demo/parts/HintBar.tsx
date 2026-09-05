import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HintBarProps {
  children: ReactNode;
  className?: string;
}

/** Barra de guía del demo. Le dice al visitante qué hacer sin obligarlo. */
export function HintBar({ children, className }: HintBarProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 border-b border-border-subtle bg-teal-50 px-4 py-2.5 text-body-sm text-teal-700',
        className,
      )}
    >
      {children}
    </p>
  );
}

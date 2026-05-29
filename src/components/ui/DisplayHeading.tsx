import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Level = 1 | 2 | 3;

type DisplayHeadingProps = {
  level: Level;
  children: ReactNode;
  italicAccent?: ReactNode;
  className?: string;
};

const sizeByLevel: Record<Level, string> = {
  1: 'text-[40px] leading-[44px] md:text-display-xl tracking-[-0.01em]',
  2: 'text-[36px] leading-[40px] md:text-display-lg tracking-[-0.01em]',
  3: 'text-[24px] leading-[28px] md:text-[28px] md:leading-[32px]',
};

export function DisplayHeading({ level, children, italicAccent, className }: DisplayHeadingProps) {
  const baseClasses = cn('editorial-display text-ink', sizeByLevel[level], className);
  const accent = italicAccent ? (
    <em className="editorial-italic text-teal-500"> {italicAccent}</em>
  ) : null;

  if (level === 1) return <h1 className={baseClasses}>{children}{accent}</h1>;
  if (level === 2) return <h2 className={baseClasses}>{children}{accent}</h2>;
  return <h3 className={baseClasses}>{children}{accent}</h3>;
}

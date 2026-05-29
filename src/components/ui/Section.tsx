import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'paper' | 'cream' | 'ink';
type Width = 'container' | 'editorial' | 'reading';

type SectionProps = {
  id?: string;
  tone?: Tone;
  width?: Width;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

const toneClasses: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  cream: 'bg-cream text-ink',
  ink: 'bg-ink text-paper',
};

const widthClasses: Record<Width, string> = {
  container: 'max-w-container',
  editorial: 'max-w-editorial',
  reading: 'max-w-reading',
};

export function Section({
  id,
  tone = 'paper',
  width = 'container',
  children,
  className,
  innerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 md:scroll-mt-24 py-24 md:py-36 px-6 md:px-10',
        toneClasses[tone],
        className
      )}
    >
      <div className={cn('mx-auto w-full', widthClasses[width], innerClassName)}>
        {children}
      </div>
    </section>
  );
}

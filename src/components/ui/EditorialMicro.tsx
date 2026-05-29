import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EditorialMicroProps = {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
};

export function EditorialMicro({ children, className, as: Tag = 'p' }: EditorialMicroProps) {
  return <Tag className={cn('editorial-micro', className)}>{children}</Tag>;
}

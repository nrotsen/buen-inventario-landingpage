import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: ReactNode;
  /** Rótulo mono sobre la descripción. */
  label?: string;
  /** Una línea explicando qué muestra la pantalla. */
  caption?: string;
  className?: string;
}

/**
 * Marco de teléfono para mostrar pantallas mobile. `children` es la
 * pantalla: hoy componentes React, mañana un <img> con un screenshot
 * real de la app — el layout no cambia.
 */
export function PhoneFrame({ children, label, caption, className }: PhoneFrameProps) {
  return (
    <div className={cn('w-[240px] shrink-0', className)}>
      <div className="rounded-[26px] border-hard border-paper bg-ink p-2.5 shadow-offset-md">
        <div className="flex h-[430px] flex-col overflow-hidden rounded-[19px] bg-paper text-ink">
          <div className="grid h-5 place-items-center" aria-hidden="true">
            <span className="block h-1 w-[52px] rounded-[3px] bg-ink/20" />
          </div>
          {children}
        </div>
      </div>
      {(label || caption) && (
        <div className="mt-3.5 text-center">
          {label && <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-teal-500">{label}</p>}
          {caption && <p className="mx-auto mt-1.5 max-w-[220px] text-body-sm text-paper/60">{caption}</p>}
        </div>
      )}
    </div>
  );
}

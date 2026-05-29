import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type NavItem = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menú de navegación">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 cursor-default"
        tabIndex={-1}
      />
      <div className="relative bg-paper border-b-hard border-ink px-6 py-8 shadow-offset-sm">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 text-ink"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <nav className="flex flex-col gap-5 mt-2">
          {items.map((item, i) => (
            <a
              key={item.href}
              ref={i === 0 ? firstLinkRef : null}
              href={item.href}
              onClick={onClose}
              className="editorial-display text-[24px] text-ink hover:text-teal-700 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

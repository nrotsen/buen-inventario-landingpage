import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from '@/components/MobileMenu';
import { signupUrl } from '@/lib/config';

const NAV = [
  { label: 'Historia', href: '#historia' },
  { label: 'Excel',    href: '#excel'    },
  { label: 'Sistema',  href: '#sistema'  },
  { label: 'Precio',   href: '#precio'   },
  { label: 'FAQ',      href: '#faq'      },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/92 backdrop-blur border-b-hard border-ink">
        <div className="max-w-container mx-auto px-6 md:px-10 h-16 md:h-[76px] flex items-center justify-between gap-6">
          <a href="#hero" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/bueninventario-logo.png"
              alt="Buen Inventario"
              width="32"
              height="32"
              className="w-7 h-7 md:w-8 md:h-8"
            />
            <span className="editorial-display text-[18px] md:text-[20px] text-ink">Buen Inventario</span>
          </a>

          <nav className="hidden md:flex gap-7">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-body-md text-ink hover:text-teal-700 transition-colors duration-150"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button as="a" href={signupUrl()} variant="primary" size="md" className="!h-9 !px-4 !text-[13px]">
              Probalo gratis <span className="font-mono">→</span>
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-ink"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={NAV} />
    </>
  );
}

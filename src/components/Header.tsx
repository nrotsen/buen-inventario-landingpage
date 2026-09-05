import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from '@/components/MobileMenu';
import { signupUrl } from '@/lib/config';
import { track } from '@/lib/analytics';

const NAV = [
  { label: 'Probalo',       href: '#demo'        },
  { label: 'Diagnóstico',   href: '#diagnostico' },
  { label: 'El sistema',    href: '#sistema'     },
  { label: 'Cómo arrancás', href: '#arrancar'    },
  { label: 'Precio',        href: '#precio'      },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/92 backdrop-blur border-b-hard border-ink">
        <div className="max-w-container mx-auto px-6 md:px-10 h-16 md:h-[76px] flex items-center justify-between gap-6">
          <a href="#hero" className="flex min-w-0 shrink items-center gap-2.5">
            <img
              src="/bueninventario-logo.png"
              alt="Buen Inventario"
              width="32"
              height="32"
              className="h-7 w-7 shrink-0 md:h-8 md:w-8"
            />
            {/*
              El wordmark se esconde debajo de 420px. Medido con Playwright:
              a 320/360/375px el bloque derecho (CTA + hamburguesa) por sí
              solo ya usa ~180px, y el texto completo del logo (~164px) no
              entra en los ~272px de contenido que quedan entre paddings —
              el header desbordaba horizontalmente. Abajo de 420px el ícono
              solo (28px) alcanza; el `alt` del ícono sigue dando el nombre
              accesible del link aunque el texto esté oculto.
            */}
            <span className="hidden editorial-display text-[18px] text-ink min-[420px]:inline md:text-[20px]">
              Buen Inventario
            </span>
          </a>

          {/*
            El nav completo recién entra a partir de `lg` (1024px). A 768px
            (`md`), logo + 5 links + CTA no entran en los ~688px de
            contenido disponibles y el header desbordaba horizontalmente
            (medido con Playwright: scrollWidth 797px vs 768px de viewport).
            Entre `md` y `lg` el visitante navega por la hamburguesa.
          */}
          <nav className="hidden gap-7 lg:flex">
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

          <div className="flex shrink-0 items-center gap-2">
            <Button
              as="a"
              href={signupUrl()}
              variant="primary"
              size="md"
              className="!h-9 !px-4 !text-[13px]"
              onClick={() => track('cta_signup_clicked', { section: 'header' })}
            >
              Probalo gratis <span className="font-mono">→</span>
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
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

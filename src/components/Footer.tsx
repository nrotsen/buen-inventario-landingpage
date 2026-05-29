import { whatsappLink, mailtoLink, instagramLink, facebookLink, tiktokLink } from '@/lib/contact';

const PRODUCT_LINKS = [
  { label: 'Cómo funciona',         href: '#sistema'  },
  { label: 'Precio',                href: '#precio'   },
  { label: 'Historia',              href: '#historia' },
  { label: 'Preguntas frecuentes',  href: '#faq'      },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper px-6 md:px-10 pt-20 md:pt-24 pb-10 md:pb-14">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-6 max-w-[420px]">
            <div className="flex items-center gap-2.5">
              <img
                src="/bueninventario-logo.png"
                alt="Buen Inventario"
                width="32"
                height="32"
                className="w-8 h-8 invert"
              />
              <span className="editorial-display text-[22px] text-paper">Buen Inventario</span>
            </div>
            <p className="mt-3.5 text-body-sm text-paper/65 leading-relaxed max-w-[40ch]">
              Sistema de gestión para almacenes y comercios chicos de Argentina. Hecho desde Don Néstor Despensa.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/50">Producto</p>
            <ul className="mt-4 flex flex-col gap-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/50">Contacto</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={mailtoLink()}
                  className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                >
                  nestorb@bueninventario.com
                </a>
              </li>
              <li>
                <a
                  href={instagramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                >
                  Instagram @bueninventario
                </a>
              </li>
              <li>
                <a
                  href={facebookLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                >
                  Facebook /bueninventario
                </a>
              </li>
              <li>
                <a
                  href={tiktokLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                >
                  TikTok (próximamente)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-7 border-t border-paper/15 flex flex-col md:flex-row items-center md:justify-between gap-3 text-body-sm text-paper/55">
          <p>© 2026 Buen Inventario · Argentina</p>
          <div className="flex gap-6">
            <a href="/terminos" className="hover:text-paper transition-colors">Términos</a>
            <a href="/privacidad" className="hover:text-paper transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

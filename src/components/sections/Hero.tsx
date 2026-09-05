import { lazy, Suspense } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { DemoFrameFallback } from '@/demo/DemoFrameFallback';
import { signupUrl } from '@/lib/config';
import { track } from '@/lib/analytics';
import { TRIAL_DAYS } from '@/lib/pricing';

/**
 * El demo entero es un chunk aparte, y `lazy()` acá es lo único que lo
 * mantiene fuera del bundle inicial. Cualquier import estático de
 * `@/demo/DemoWidget` desde otro archivo lo devuelve al chunk principal.
 */
const DemoWidget = lazy(() =>
  import('@/demo/DemoWidget').then((m) => ({ default: m.DemoWidget })),
);

export function Hero() {
  return (
    <Section id="hero" tone="paper" className="pb-16 pt-10 md:pb-28 md:pt-28">
      {/*
        El split a dos columnas arranca en `xl` (1280px), no en `lg`.

        Medido con Playwright sobre este Hero: con el split en `lg` y una
        columna de copy de 420px, a 1024px de viewport al demo le quedaban
        468px y su grilla de productos caía a columnas de 39px con tiles de
        126px de alto. El demo decide su layout interno por viewport y no por
        el ancho que le toca, así que en ese rango arrastraba el layout de
        escritorio — ticket lateral de 300px — dentro de una caja angosta.

        Abajo de 1280 no hay reparto que sirva: a 1024px el contenedor da
        944px útiles y el demo necesita ~720px para respirar, con lo cual al
        copy no le quedan 350px legibles. Por eso abajo de `xl` va apilado.

        El `max-w-[720px]` del apilado va sobre la grilla entera, no sobre el
        demo: le da al demo el mismo ancho que tiene en la columna de `xl`
        (724px) y de paso deja el copy sobre el mismo eje izquierdo que el
        borde del demo, en vez de un copy al ras y un demo flotando centrado.
      */}
      <div className="mx-auto grid max-w-[720px] grid-cols-1 items-start gap-5 md:gap-10 xl:max-w-none xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:gap-14">
        <div>
          {/*
            El eyebrow completo mide 314px y necesita 363px de viewport para
            entrar en una línea. En un 360 (el Android más común de la base)
            pasaba a dos, y esas 16px empujaban la barra de capítulos del demo
            abajo del fold de 640px. Abajo de 368px se cae "· Argentina": el
            país ya lo dice el precio en pesos.
          */}
          <EditorialMicro>
            Sistema de gestión · Comercios
            <span className="hidden min-[368px]:inline"> · Argentina</span>
          </EditorialMicro>

          <h1 className="editorial-display mt-3 text-[40px] leading-[1.04] tracking-[-0.015em] md:mt-5 md:text-[58px]">
            No te pido que me creas.
            <br />
            <em className="editorial-italic text-teal-500">Probalo acá.</em>
          </h1>

          {/*
            En mobile la lede se acorta a dos líneas: cada línea de copy acá
            arriba empuja al demo abajo del fold de 640px, y el demo visible
            es el argumento entero de esta pantalla.
          */}
          <p className="mt-4 max-w-[44ch] text-body-lg text-ink/80 md:mt-6">
            Esto <span className="hidden xl:inline">de al lado</span>
            <span className="xl:hidden">de abajo</span>{' '}
            <strong className="font-semibold">es el sistema</strong>, no un video.{' '}
            <span className="hidden md:inline">
              Hacé una venta, fiale a un cliente, cerrá la caja. Sin registrarte, sin dar un
              mail, ahora mismo.
            </span>
            <span className="md:hidden">Probalo sin registrarte.</span>
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-8">
            <Button
              as="a"
              href={signupUrl()}
              variant="primary"
              size="lg"
              onClick={() => track('cta_signup_clicked', { section: 'hero' })}
            >
              Empezar {TRIAL_DAYS} días gratis <span className="font-mono">→</span>
            </Button>
            <Button as="a" href="#demo" variant="ghost-accent" size="lg" className="xl:hidden">
              Ver el demo ↓
            </Button>
          </div>

          <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-text-muted md:mt-7">
            Sin tarjeta <span className="text-teal-600">·</span> Cancelás cuando quieras
            <br />
            Hecho en un almacén real<span className="hidden md:inline">, usado todos los días</span>
          </p>
        </div>

        <div id="demo" className="scroll-mt-24">
          <Suspense fallback={<DemoFrameFallback />}>
            <DemoWidget />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}

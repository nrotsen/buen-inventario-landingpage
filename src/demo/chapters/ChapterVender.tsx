import { useRef } from 'react';
import { track } from '@/lib/analytics';
import { PRODUCTS, type PaymentMethod } from '../data';
import { useSale } from '../useSale';
import { HintBar } from '../parts/HintBar';
import { ProductTile } from '../parts/ProductTile';
import { Ticket } from '../parts/Ticket';
import { MethodPicker } from '../parts/MethodPicker';
import { SaleReveal } from '../parts/SaleReveal';

interface ChapterVenderProps {
  /** Elegir "Fiado" salta al capítulo 02. */
  onGoToFiar: () => void;
}

const HINTS = {
  empty: <>👆 <b className="font-semibold">Tocá dos o tres productos</b> — como si estuvieras atendiendo.</>,
  loaded: <>👆 Seguí cargando, o <b className="font-semibold">tocá "Cobrar"</b> cuando termines.</>,
  methods: <>💳 <b className="font-semibold">Elegí cómo te paga.</b> Probá "Fiado" para ver qué pasa.</>,
  done: <>✅ <b className="font-semibold">Listo.</b> Mirá lo que el sistema anotó solo.</>,
} as const;

export function ChapterVender({ onGoToFiar }: ChapterVenderProps) {
  const sale = useSale();
  const startedRef = useRef(false);

  function handleAdd(id: string) {
    if (!startedRef.current) {
      startedRef.current = true;
      track('demo_started');
    }
    sale.add(id);
  }

  function handlePick(method: PaymentMethod) {
    if (method === 'Fiado') {
      sale.reset();
      startedRef.current = false;
      onGoToFiar();
      return;
    }
    track('demo_sale_completed', { method, total: sale.total });
    sale.pay(method);
  }

  function handleAgain() {
    sale.reset();
    startedRef.current = false;
  }

  const hint =
    sale.view === 'done' ? HINTS.done
    : sale.view === 'methods' ? HINTS.methods
    : sale.isEmpty ? HINTS.empty
    : HINTS.loaded;

  return (
    <div>
      <HintBar>{hint}</HintBar>

      {sale.view === 'pos' && (
        <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-[1fr_300px]">
          <div className="grid grid-cols-2 content-start gap-2.5 p-3.5 min-[520px]:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <ProductTile
                key={p.id}
                product={p}
                onAdd={handleAdd}
                nudge={i === 0 && sale.isEmpty}
              />
            ))}
          </div>
          <Ticket lines={sale.lines} total={sale.total} onPay={sale.goToMethods} />
        </div>
      )}

      {sale.view === 'methods' && <MethodPicker onPick={handlePick} />}

      {sale.view === 'done' && sale.method && sale.firstLine && (
        <SaleReveal
          total={sale.total}
          margin={sale.margin}
          units={sale.units}
          method={sale.method}
          firstLine={sale.firstLine}
          onAgain={handleAgain}
        />
      )}
    </div>
  );
}

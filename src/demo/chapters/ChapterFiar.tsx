import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import {
  CLIENT_NAME, CLIENT_SINCE, CLIENT_MOVE_COUNT,
  LEDGER_OPENING_BALANCE, LEDGER_MOVES, LEDGER_NEW_SALE, type LedgerMove,
} from '../data';
import { HintBar } from '../parts/HintBar';

function MoveRow({ move, highlight = false }: { move: LedgerMove; highlight?: boolean }) {
  const isPayment = move.amount < 0;
  return (
    <div className={cn(
      'grid grid-cols-[74px_1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 text-body-sm',
      highlight && '-mx-4 bg-teal-50 px-4',
    )}>
      <span className="font-mono text-[11px] text-text-muted">{move.date}</span>
      <span>
        {move.label}
        <span className="mt-0.5 block text-[11.5px] text-text-muted">{move.detail}</span>
      </span>
      <span className={cn('whitespace-nowrap text-right font-mono font-medium', isPayment && 'text-teal-700')}>
        {isPayment ? '−' : '+'} {formatArs(Math.abs(move.amount))}
      </span>
    </div>
  );
}

export function ChapterFiar() {
  const [anotada, setAnotada] = useState(false);
  const balance = LEDGER_OPENING_BALANCE + (anotada ? LEDGER_NEW_SALE.amount : 0);

  return (
    <div>
      <HintBar>🧾 <b className="font-semibold">Marcos se lo lleva anotado.</b> Esto es lo que queda registrado.</HintBar>

      <div className="px-4 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-hard border-ink pb-3.5">
          <div>
            <p className="editorial-micro">Cuenta corriente</p>
            <p className="editorial-display text-[24px]">{CLIENT_NAME}</p>
            <p className="mt-1 font-mono text-[11px] text-text-muted">
              Cliente desde {CLIENT_SINCE} · {CLIENT_MOVE_COUNT} movimientos
            </p>
          </div>
          <div className="text-right" aria-live="polite">
            <p className="editorial-micro">Saldo actual</p>
            <p className="editorial-display text-[27px] text-teal-700">{formatArs(balance)}</p>
          </div>
        </div>

        <div className="mt-1.5">
          {anotada && <MoveRow move={LEDGER_NEW_SALE} highlight />}
          {LEDGER_MOVES.map((m) => <MoveRow key={m.id} move={m} />)}
        </div>

        {!anotada ? (
          <button
            type="button"
            onClick={() => setAnotada(true)}
            className="mt-5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Anotar la venta de hoy en la cuenta de Marcos
          </button>
        ) : (
          <p className="editorial-italic mt-5 text-[18px] leading-snug text-teal-700">
            Si mañana discute lo que se llevó, abrís la cuenta y se termina la discusión.
          </p>
        )}
      </div>
    </div>
  );
}

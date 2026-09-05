import { formatArs } from '@/lib/pricing';
import { CLIENT_NAME, LEDGER_NEW_SALE, LEDGER_MOVES, LEDGER_OPENING_BALANCE } from '@/lib/showcase-data';

interface FiadoMove {
  key: string;
  label: string;
  subtitle: string;
  amount: number;
}

/** Las dos entradas previas del historial, antes de la venta nueva. */
const PRIOR_MOVES = LEDGER_MOVES.slice(0, 2);

const MOVES: FiadoMove[] = [
  {
    key: LEDGER_NEW_SALE.id,
    label: LEDGER_NEW_SALE.label,
    subtitle: `${LEDGER_NEW_SALE.date} · ${LEDGER_NEW_SALE.detail}`,
    amount: LEDGER_NEW_SALE.amount,
  },
  ...PRIOR_MOVES.map((move) => ({
    key: move.id,
    label: move.label,
    subtitle: `${move.date} · ${move.detail}`,
    amount: move.amount,
  })),
];

/** El saldo tras anotar la venta nueva: lo que debía + lo que se llevó recién. */
const BALANCE = LEDGER_OPENING_BALANCE + LEDGER_NEW_SALE.amount;

function formatSigned(amount: number): string {
  return amount > 0 ? `+${formatArs(amount)}` : formatArs(amount);
}

/**
 * Pantalla "Fiado": la cuenta corriente de un cliente justo después de que
 * el capítulo 02 le anote la venta. El saldo se deriva sumando el arranque
 * y la venta nueva — nunca se escribe el número.
 */
export function PhoneFiado() {
  return (
    <>
      <div className="flex items-center justify-between border-b-hard border-ink bg-cream px-3 py-2.5">
        <span className="editorial-display text-[15px]">{CLIENT_NAME}</span>
        <span className="font-mono text-[9px] text-text-muted">CTA. CTE.</span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.09em] text-text-muted">Saldo</p>
          <p className="editorial-display text-[23px]">
            {formatArs(BALANCE)} <span className="font-mono text-[11px] font-normal text-teal-700">debe</span>
          </p>
        </div>

        <div className="mt-3">
          {MOVES.map((move) => (
            <div
              key={move.key}
              className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-dashed border-border-subtle py-2 text-[11.5px]"
            >
              <span>
                {move.label}
                <span className="block text-[9.5px] text-text-muted">{move.subtitle}</span>
              </span>
              <span className="font-mono font-medium">{formatSigned(move.amount)}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto grid h-[38px] place-items-center border-hard border-ink bg-ink text-[12.5px] text-paper shadow-offset-xs">
          Registrar un pago
        </div>
      </div>
    </>
  );
}

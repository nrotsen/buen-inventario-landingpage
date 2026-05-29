const METHODS = [
  ['Efectivo',         '$48.290'],
  ['Transferencia',    '$22.450'],
  ['Débito',           '$31.180'],
  ['Crédito',          '$14.920'],
  ['Mercado Pago',     '$9.640'],
  ['Cuenta corriente', '$6.420'],
];

export function CajaFakeScreen() {
  return (
    <div className="px-6 pt-6 pb-7 md:px-8 text-left">
      <div className="flex justify-between items-baseline pb-3.5 border-b-hard border-ink">
        <h4 className="editorial-display text-[20px] text-ink">Cierre del día · 27 mayo</h4>
        <span className="editorial-micro">Caja abierta 8:30 · Cerrada 21:14</span>
      </div>
      <div className="mt-3.5 grid grid-cols-2 border-hard border-ink">
        {METHODS.map(([label, val], i) => {
          const isLastCol = i % 2 === 1;
          const isLastRow = i >= METHODS.length - 2;
          return (
            <div
              key={label}
              className={`px-3.5 py-3.5 ${!isLastCol ? 'border-r border-dashed border-border-subtle' : ''} ${!isLastRow ? 'border-b border-dashed border-border-subtle' : ''}`}
            >
              <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-text-muted">{label}</div>
              <div className="editorial-display text-[20px] mt-1 text-ink">{val}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3.5 flex justify-between items-baseline p-4 bg-ink text-paper rounded-sm">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/70">Total del día · 87 ventas</div>
        <div className="editorial-display text-[28px]">$132.900</div>
      </div>
    </div>
  );
}

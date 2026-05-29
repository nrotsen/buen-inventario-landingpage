const MOVEMENTS = [
  { date: '22 MAY', desc: '3× fideos Lucchetti + 1× aceite Cocinero', amt: '+ $4.890',  payment: false },
  { date: '20 MAY', desc: 'Pago a cuenta (efectivo)',                  amt: '− $10.000', payment: true  },
  { date: '18 MAY', desc: 'Compra del día (12 items)',                 amt: '+ $7.420',  payment: false },
  { date: '15 MAY', desc: '2× detergente Magistral + 1× shampoo Plusbelle', amt: '+ $5.180', payment: false },
  { date: '12 MAY', desc: 'Pan, leche, queso (semana)',                amt: '+ $6.790',  payment: false },
];

export function LedgerFakeScreen() {
  return (
    <div className="px-6 pt-6 pb-7 md:px-8 text-left">
      <div className="flex justify-between items-start pb-3.5 border-b-hard border-ink">
        <div>
          <div className="editorial-display text-[22px] text-ink">Marcos López</div>
          <div className="editorial-micro mt-0.5">Cliente desde marzo 2024 · 38 movimientos</div>
        </div>
        <div className="text-right">
          <div className="editorial-display text-[26px] text-ink">$14.280</div>
          <div className="editorial-micro">Saldo deudor</div>
        </div>
      </div>
      <div className="mt-3">
        {MOVEMENTS.map((m) => (
          <div
            key={m.date + m.desc}
            className="grid grid-cols-[90px_1fr_auto] gap-3.5 py-2.5 border-b border-dashed border-border-subtle text-[13px]"
          >
            <span className="font-mono text-[11px] text-text-muted">{m.date}</span>
            <span className="text-ink">{m.desc}</span>
            <span className={`font-mono ${m.payment ? 'text-teal-700' : 'text-ink'}`}>{m.amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

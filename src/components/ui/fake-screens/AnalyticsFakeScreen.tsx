const BARS = [38, 54, 47, 72, 65, 81, 58, 90, 73, 86, 67, 95, 78, 62];

export function AnalyticsFakeScreen() {
  return (
    <div className="px-6 pt-7 pb-8 md:px-10 md:pt-9 md:pb-10 text-left">
      <div className="flex items-baseline justify-between pb-4 border-b border-dashed border-border-subtle">
        <div className="flex items-baseline gap-2.5">
          <h4 className="editorial-display text-[19px] text-ink">Analíticas</h4>
          <span className="editorial-micro">Junio 2026</span>
        </div>
        <div className="font-mono text-[11px] py-1 px-2.5 border border-ink rounded-sm bg-surface">
          Don Néstor <span className="text-text-muted">▾</span>
        </div>
      </div>
      <div className="mt-5">
        <div className="editorial-display text-[48px] md:text-[64px] leading-none tracking-[-0.02em] text-ink">
          $1.847.500
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="editorial-micro">Ventas totales</span>
          <span className="font-mono text-[11px] text-teal-700">↑ 18% vs mayo</span>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-6 border-hard border-ink">
        {[
          ['Beneficio', '$623.290'],
          ['Ticket promedio', '$4.820'],
          ['Productos vendidos', '383'],
        ].map(([label, value], i) => (
          <div
            key={label}
            className={`px-3.5 py-3.5 ${i < 2 ? 'border-r border-dashed border-border-subtle' : ''}`}
          >
            <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-text-muted">{label}</div>
            <div className="editorial-display text-[22px] md:text-[26px] mt-1 leading-tight text-ink">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-end gap-1.5 h-20 border-b-hard border-ink pb-0.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-teal-500 border-t-hard border-ink"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="editorial-micro mt-2.5">Últimos 14 días</p>
    </div>
  );
}

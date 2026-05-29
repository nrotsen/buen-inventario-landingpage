const ROWS = [
  { name: 'Atún Gomes de la Costa lata grande', stock: 14, costo: '$1.840', venta: '$2.690', dias: 87, dead: true },
  { name: "Mayonesa Hellmann's pote 1kg",        stock: 9,  costo: '$2.300', venta: '$3.190', dias: 62, dead: true },
  { name: 'Yerba Rosamonte 1kg',                 stock: 23, costo: '$2.150', venta: '$2.890', dias: 41, dead: true },
  { name: 'Coca-Cola 2.25L',                     stock: 32, costo: '$1.890', venta: '$2.450', dias: 3,  dead: false },
  { name: 'Pan lactal Bimbo grande',             stock: 12, costo: '$1.720', venta: '$2.280', dias: 1,  dead: false },
  { name: 'Leche La Serenísima 1L',              stock: 48, costo: '$890',   venta: '$1.190', dias: 0,  dead: false },
];

export function ProductsFakeScreen() {
  return (
    <div className="px-6 pt-6 pb-7 md:px-8 text-left">
      <div className="flex justify-between items-baseline pb-3.5 border-b-hard border-ink">
        <h4 className="editorial-display text-[18px] text-ink">Productos · 247 activos</h4>
        <span className="editorial-micro">Ordenado por días sin venta ↓</span>
      </div>
      <table className="w-full mt-2.5 border-collapse">
        <thead>
          <tr className="border-b border-dashed border-border-subtle">
            <th className="text-left py-2 pr-2 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Producto</th>
            <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Stock</th>
            <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Costo</th>
            <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">P. venta</th>
            <th className="text-right py-2 pl-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Días s/v</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.name} className={`border-b border-dashed border-border-subtle ${r.dead ? 'text-text-muted' : 'text-ink'}`}>
              <td className="py-2.5 pr-2 text-[12px] font-medium">{r.name}</td>
              <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.stock}</td>
              <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.costo}</td>
              <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.venta}</td>
              <td className={`py-2.5 pl-1.5 text-[12px] font-mono text-right ${r.dead ? 'text-teal-700 font-medium' : ''}`}>{r.dias}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

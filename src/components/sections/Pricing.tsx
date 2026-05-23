import { signupUrl } from "@/lib/config";

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#fafaf7] py-20 px-4">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-gray-600">
          Plan único
        </p>
        <h2 className="mt-3 text-5xl md:text-6xl font-serif leading-[1.05] tracking-tight">
          Un precio,
          <br />
          <span className="italic text-teal-500">todo incluido.</span>
        </h2>
        <p className="mt-5 text-gray-700 text-base leading-relaxed">
          Sin tiers, sin add-ons, sin sorpresas en el resumen de la tarjeta.
          <br />
          Lo que ves es lo que pagás.
        </p>
      </div>

      <div className="mt-16 max-w-md mx-auto bg-white border border-black p-10">
        <div className="text-center border-b border-black pb-7 mb-7">
          <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-gray-600">
            Plan Standard
          </p>
          <p className="mt-2 font-serif text-6xl leading-none">
            $14.900<span className="text-2xl text-gray-600"> / mes</span>
          </p>
          <p className="mt-2 text-gray-600 text-sm">ARS · Renueva automáticamente</p>
        </div>
        <ul className="space-y-2 text-[15px] text-gray-700">
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Stock + Caja + Clientes + Proveedores
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Multi-user (admins, managers, empleados)
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Mi Web — tienda online incluida
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Analíticas + Métricas
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Pagos vía Mercado Pago
          </li>
          <li className="flex items-center gap-3">
            <span className="text-teal-500 font-mono">✓</span>
            Soporte por email
          </li>
        </ul>
        <button
          onClick={() => {
            window.location.href = signupUrl();
          }}
          className="mt-8 w-full bg-black text-white py-4 font-semibold border border-black hover:bg-teal-500 hover:border-teal-500 transition-colors flex items-center justify-center gap-2"
        >
          Empezá 30 días gratis
          <span className="font-mono">→</span>
        </button>
        <p className="mt-3 text-center text-xs text-gray-600">
          Sin tarjeta. Cancelás cuando quieras.
        </p>
      </div>
    </section>
  );
}

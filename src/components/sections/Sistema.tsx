import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { PhoneRow } from './sistema/PhoneRow';

interface Capability {
  tag: string;
  title: string;
  body: string;
}

const CAPABILITIES: Capability[] = [
  {
    tag: 'Catálogo',
    title: 'Tu rubro ya viene cargado',
    body: 'Casi 30.000 productos con código de barras, marca y presentación, listos para usar. Kiosco, ferretería, carnicería, verdulería, pescadería, indumentaria. Escaneás y aparece.',
  },
  {
    tag: 'Facturación',
    title: 'ARCA, cuando vos quieras',
    body: 'Facturación electrónica integrada, homologada. Vos decidís venta por venta si facturás o no. El sistema no te controla ni te denuncia.',
  },
  {
    tag: 'Sucursales',
    title: 'Más de un local',
    body: 'Stock, caja y precios por sucursal, con la vista consolidada arriba. Si abrís el segundo, no empezás un sistema nuevo.',
  },
  {
    tag: 'Tienda web',
    title: 'Tu comercio online, sin programar',
    body: 'Tienda propia conectada al mismo stock. Los pedidos web entran a la misma caja. Elegís el diseño y sale publicada.',
  },
  {
    tag: 'Migración',
    title: 'Subís tus archivos Excel y se cargan solos',
    body: 'Importación masiva de productos, clientes y proveedores. No hay que tipear nada de nuevo.',
  },
  {
    tag: 'Rotación',
    title: 'Qué se vende y qué duerme',
    body: 'Días sin venta por producto, margen real y capital inmovilizado. Sabés qué dejar de comprar antes de comprarlo.',
  },
];

export function Sistema() {
  return (
    <Section id="sistema" tone="ink" className="py-28 md:py-44">
      <div className="max-w-[760px]">
        <EditorialMicro className="!text-paper/55">Lo que hay debajo</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>Abajo hay bastante más.</>} className="mt-5 !text-paper">
          Recién usaste la caja.
        </DisplayHeading>
        <p className="mt-6 max-w-[55ch] text-body-lg leading-relaxed text-paper/70">
          No es una app de inventario. Es el sistema completo de un comercio — y está construido para bancar el
          tuyo cuando crezca.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 border-t-hard border-paper md:grid-cols-2">
        {CAPABILITIES.map((capability, i) => {
          const isLeftColumn = i % 2 === 0;
          return (
            <div
              key={capability.tag}
              className={`border-b border-dashed border-paper/20 py-6 ${
                isLeftColumn ? 'md:border-r md:pr-8' : 'md:pl-8'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-teal-500">{capability.tag}</p>
              <h3 className="editorial-display mt-1.5 text-[22px] leading-snug text-paper">{capability.title}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-paper/65">{capability.body}</p>
            </div>
          );
        })}
      </div>

      <PhoneRow />
    </Section>
  );
}

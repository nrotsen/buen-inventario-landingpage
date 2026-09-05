import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { PhoneVender } from '@/components/ui/phone-screens/PhoneVender';
import { PhoneFiado } from '@/components/ui/phone-screens/PhoneFiado';
import { PhoneCierre } from '@/components/ui/phone-screens/PhoneCierre';

/**
 * Sub-bloque de teléfonos al cierre de la sección Sistema. Fila con scroll
 * horizontal + snap en mobile — los tres `PhoneFrame` no entran a la vez
 * en una pantalla chica.
 */
export function PhoneRow() {
  return (
    <div className="mt-20 text-center">
      <EditorialMicro className="!text-teal-500">En el mostrador</EditorialMicro>
      <DisplayHeading level={2} italicAccent={<>desde el celular.</>} className="mt-5 !text-paper">
        Y todo esto,
      </DisplayHeading>
      <p className="mx-auto mt-6 max-w-[52ch] text-body-lg leading-relaxed text-paper/70">
        No hay que instalar nada ni comprar una computadora. Se abre en el navegador del teléfono que ya tenés.
      </p>

      <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:justify-center md:overflow-x-visible md:px-0">
        <PhoneFrame
          className="snap-center"
          label="Vender"
          caption="Atendés con una mano mientras cobrás con la otra."
        >
          <PhoneVender />
        </PhoneFrame>
        <PhoneFrame
          className="snap-center"
          label="Fiado"
          caption="La cuenta de cada cliente, en el bolsillo."
        >
          <PhoneFiado />
        </PhoneFrame>
        <PhoneFrame
          className="snap-center"
          label="Cierre de caja"
          caption="El día cerrado antes de bajar la persiana."
        >
          <PhoneCierre />
        </PhoneFrame>
      </div>
    </div>
  );
}

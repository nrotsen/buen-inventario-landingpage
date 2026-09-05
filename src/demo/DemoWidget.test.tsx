import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemoWidget } from './DemoWidget';

describe('DemoWidget', () => {
  it('arranca en el capítulo 01 con el ticket vacío', () => {
    render(<DemoWidget />);
    expect(screen.getByRole('tab', { name: /Vendés/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Todavía no cargaste nada/)).toBeInTheDocument();
  });

  it('completa una venta y muestra la ganancia real correcta', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    // Coca ×2 → margen (2400-1750)*2 = 1300 · total 4800
    const coca = screen.getByRole('button', { name: /Agregar Coca-Cola 1\.5L/ });
    await user.click(coca);
    await user.click(coca);

    await user.click(screen.getByRole('button', { name: 'Cobrar' }));
    await user.click(screen.getByRole('button', { name: 'Efectivo' }));

    expect(screen.getByText(/Venta registrada · \$4\.800/)).toBeInTheDocument();
    expect(screen.getByText('$1.300')).toBeInTheDocument();
    // Stock 24 → 22
    expect(screen.getByText(/22 unidades/)).toBeInTheDocument();
  });

  it('no deja cobrar con el carrito vacío', () => {
    render(<DemoWidget />);
    expect(screen.getByRole('button', { name: 'Cobrar' })).toBeDisabled();
  });

  it('elegir Fiado salta al capítulo 02', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);
    await user.click(screen.getByRole('button', { name: /Agregar Pan lactal/ }));
    await user.click(screen.getByRole('button', { name: 'Cobrar' }));
    await user.click(screen.getByRole('button', { name: /Fiado/ }));
    expect(screen.getByRole('tab', { name: /Fiás/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('anotar en la cuenta actualiza el saldo', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);
    await user.click(screen.getByRole('tab', { name: /Fiás/ }));
    const panel = screen.getByRole('tabpanel', { name: /Fiás/ });
    await user.click(within(panel).getByRole('button', { name: /Anotar la venta de hoy/ }));
    expect(within(panel).getByText('$29.970')).toBeInTheDocument();
  });

  it('cerrar caja muestra la ganancia del día', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);
    await user.click(screen.getByRole('tab', { name: /Cerrás/ }));
    const panel = screen.getByRole('tabpanel', { name: /Cerrás/ });
    expect(within(panel).getByText('$389.640')).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: 'Cerrar caja' }));
    expect(within(panel).getByText('Caja cerrada')).toBeInTheDocument();
    expect(within(panel).getByText('$104.190')).toBeInTheDocument();
  });

  it('las flechas navegan entre capítulos y mueven el foco', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);
    await user.click(screen.getByRole('tab', { name: /Vendés/ }));

    await user.keyboard('{ArrowRight}');
    const fias = screen.getByRole('tab', { name: /Fiás/ });
    expect(fias).toHaveAttribute('aria-selected', 'true');
    expect(fias).toHaveFocus();

    // Desde el 02 hacia atrás vuelve al 01; desde el 01 da la vuelta al 03.
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: /Vendés/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    const cerras = screen.getByRole('tab', { name: /Cerrás/ });
    expect(cerras).toHaveAttribute('aria-selected', 'true');
    expect(cerras).toHaveFocus();
  });

  it('cambiar de capítulo no resetea el estado de los otros', async () => {
    const user = userEvent.setup();
    render(<DemoWidget />);

    // Capítulo 01: cargar un producto.
    await user.click(screen.getByRole('button', { name: /Agregar Coca-Cola 1\.5L/ }));

    // Capítulo 03: cerrar la caja.
    await user.click(screen.getByRole('tab', { name: /Cerrás/ }));
    const cierre = screen.getByRole('tabpanel', { name: /Cerrás/ });
    await user.click(within(cierre).getByRole('button', { name: 'Cerrar caja' }));

    // Volver al 01: el ticket sigue cargado.
    await user.click(screen.getByRole('tab', { name: /Vendés/ }));
    const venta = screen.getByRole('tabpanel', { name: /Vendés/ });
    expect(within(venta).queryByText(/Todavía no cargaste nada/)).not.toBeInTheDocument();
    expect(within(venta).getByRole('button', { name: 'Cobrar' })).toBeEnabled();

    // Y el 03 sigue cerrado.
    await user.click(screen.getByRole('tab', { name: /Cerrás/ }));
    expect(within(screen.getByRole('tabpanel', { name: /Cerrás/ })).getByText('Caja cerrada')).toBeInTheDocument();
  });
});

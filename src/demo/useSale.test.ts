import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSale } from './useSale';
import { PRODUCTS } from './data';

const coca = PRODUCTS.find((p) => p.id === 'coca')!;   // 2400 / 1750 / stock 24
const pan  = PRODUCTS.find((p) => p.id === 'pan')!;    // 1850 / 1290 / stock 12

describe('useSale', () => {
  it('arranca vacío, en la vista del punto de venta', () => {
    const { result } = renderHook(() => useSale());
    expect(result.current.view).toBe('pos');
    expect(result.current.lines).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it('suma un producto y calcula el total', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.add('coca'));
    expect(result.current.total).toBe(2400);
    expect(result.current.units).toBe(1);
    expect(result.current.isEmpty).toBe(false);
  });

  it('agrupa el mismo producto en una línea con cantidad', () => {
    const { result } = renderHook(() => useSale());
    act(() => { result.current.add('coca'); });
    act(() => { result.current.add('coca'); });
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].qty).toBe(2);
    expect(result.current.total).toBe(4800);
  });

  it('calcula la ganancia real como (precio - costo) por cantidad', () => {
    const { result } = renderHook(() => useSale());
    act(() => { result.current.add('coca'); });
    act(() => { result.current.add('coca'); });
    act(() => { result.current.add('pan'); });
    // coca: (2400-1750)*2 = 1300 · pan: (1850-1290)*1 = 560
    expect(result.current.margin).toBe(1860);
    expect(result.current.total).toBe(2400 * 2 + 1850);
  });

  it('el stock resultante del primer producto descuenta lo vendido', () => {
    const { result } = renderHook(() => useSale());
    act(() => { result.current.add('coca'); });
    act(() => { result.current.add('coca'); });
    expect(result.current.firstLine?.product.stock).toBe(coca.stock);
    expect(result.current.firstLine?.stockAfter).toBe(coca.stock - 2);
  });

  it('ignora un id de producto inexistente sin romper', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.add('no-existe'));
    expect(result.current.lines).toHaveLength(0);
  });

  it('no deja pasar a métodos de pago con el carrito vacío', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.goToMethods());
    expect(result.current.view).toBe('pos');
  });

  it('pasa a métodos de pago con el carrito cargado', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.add('pan'));
    act(() => result.current.goToMethods());
    expect(result.current.view).toBe('methods');
  });

  it('cobrar guarda el método y pasa al reveal', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.add('pan'));
    act(() => result.current.goToMethods());
    act(() => result.current.pay('Efectivo'));
    expect(result.current.view).toBe('done');
    expect(result.current.method).toBe('Efectivo');
    expect(result.current.total).toBe(pan.price);
  });

  it('reset vuelve al estado inicial', () => {
    const { result } = renderHook(() => useSale());
    act(() => result.current.add('coca'));
    act(() => result.current.goToMethods());
    act(() => result.current.pay('Débito'));
    act(() => result.current.reset());
    expect(result.current.view).toBe('pos');
    expect(result.current.lines).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.method).toBeNull();
  });
});

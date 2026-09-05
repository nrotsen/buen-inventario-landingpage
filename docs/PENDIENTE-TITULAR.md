# Pendiente del titular — antes de publicar la landing v3

Cosas que **no puedo resolver yo** y que hay que decidir antes del deploy.

## 1. Precio en Mercado Pago — BLOQUEANTE

La landing publica **$24.900/mes**. El `preapproval_plan` de Mercado Pago
(`MP_PREAPPROVAL_PLAN_ID`) sigue en **$14.900**.

Sincronizarlo son dos operaciones distintas:
- `PUT /preapproval_plan/{id}` → cambia el precio para quien se suscriba de ahora en más.
- `PUT /preapproval/{id}` → hay que hacerlo **por cada suscriptor existente**.

Grandfatherear a los clientes actuales es una decisión comercial tuya, no un efecto automático.

Además, `PLAN_AMOUNT = 14900` en `buen-carrito-backend/src/controllers/adminBilling.controller.ts:199`
va a reportar MRR incorrecto. Ese cálculo debería sumar los `planAmount` reales de cada
suscripción en vez de multiplicar cantidad × constante — con precios mezclados da mal en
las dos direcciones.

## 2. Datos legales que quedaron fuera

Los términos y la política están escritos y son publicables, pero se redactaron **sin**
estos datos porque no los tengo. Si querés que figuren, decímelos y los agrego:

- Razón social y CUIT del titular.
- Domicilio legal (hoy figura solo el domicilio electrónico de contacto).
- Ciudad de los tribunales competentes (hoy dice "tribunales ordinarios competentes de la
  República Argentina", sin ciudad).
- **Tratamiento de IVA del precio.** Hoy los términos dicen que $24.900 es "el importe que
  se debita, sin cargos adicionales" — verdadero en cualquier caso. Si sos responsable
  inscripto y el precio es + IVA, hay que decirlo explícitamente.

**Leelos antes de mergear.** Son `public/terminos.html` y `public/privacidad.html`.

## 3. Point-in-Time Recovery en DynamoDB — riesgo de infraestructura

Verificado el 2026-09-05 contra la cuenta de producción: **PITR está DESACTIVADO en 42 de
44 tablas**. Solo `CashFlowUserSnapshot` y `Combos` lo tienen.

Sin PITR en `Products`, `Orders`, `Clients`, `Companies`, `Users` y `Subscriptions`, no hay
forma de recuperar los datos si un borrado accidental o una migración mala los corrompe.
Es independiente de la landing.

Por eso el FAQ **no promete copias de seguridad** — dice solo que los datos viven en la nube,
en AWS, que es cierto. Si activás PITR, se puede agregar la frase.

Habilitarlo, por tabla:
```
aws dynamodb update-continuous-backups --table-name <tabla> \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```
Tiene costo por almacenamiento continuo. Es tu decisión.

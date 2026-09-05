import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Deriva de `vite.config.ts` en vez de redeclarar plugins y alias.
 * Si el alias `@` o los plugins cambian allá, acá se reflejan solos.
 *
 * Sin `globals: true` a propósito: los tests importan `describe`/`it`/`expect`
 * explícitamente desde 'vitest'. Habilitar globals obligaría a sumar
 * "vitest/globals" a los types de tsconfig.app.json, que incluye TODO `src` —
 * y entonces un `expect()` escrito por error dentro de un componente de
 * producción compilaría limpio y explotaría como ReferenceError en el browser.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      // Necesario solo mientras no exista ningún test. La Task 2 agrega el
      // primero y lo remueve: dejarlo haría que un glob roto pase en verde
      // con cero tests corridos.
      passWithNoTests: true,
    },
  }),
);

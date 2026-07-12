/**
 * Envuelve un dynamic import() con reintentos automáticos.
 * Si la red falla al descargar un chunk lazy, lo reintenta hasta 3 veces
 * con un delay de 2s entre cada intento antes de lanzar el error final.
 */
export function retryImport<T>(importFn: () => Promise<T>): () => Promise<T> {
  const MAX_RETRIES = 2;
  const DELAY_MS = 2000;

  return () => {
    let lastError: unknown;

    const attempt = (remaining: number): Promise<T> => {
      return importFn().catch((err) => {
        lastError = err;
        if (remaining <= 0) {
          console.warn(`[retryImport] Se agotaron los reintentos para el chunk.`, err);
          throw err;
        }
        console.warn(`[retryImport] Error cargando chunk, reintentando (${remaining} restantes)...`, err);
        return new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS)).then(() => attempt(remaining - 1));
      });
    };

    return attempt(MAX_RETRIES);
  };
}

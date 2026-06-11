export const TOO_MANY_REQUESTS_TITLE = 'Demasiadas consultas';
export const TOO_MANY_REQUESTS_MSG =
  'Has hecho demasiadas consultas. Espera un momento e inténtalo de nuevo.';

/** Detecta respuestas 429 (rate limit del backend / ThrottlerGuard). */
export function isTooManyRequests(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const status = (error as { response?: { status?: number } }).response?.status;
  return status === 429;
}

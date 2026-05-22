export const APP_URL =
  (import.meta.env.VITE_APP_URL as string | undefined) ?? 'http://localhost:5173';

export function signupUrl(prefilledEmail?: string): string {
  const base = `${APP_URL.replace(/\/$/, '')}/signup`;
  return prefilledEmail ? `${base}?email=${encodeURIComponent(prefilledEmail)}` : base;
}

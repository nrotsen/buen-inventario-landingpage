const WHATSAPP_NUMBER = '5491122775850';
const EMAIL = 'nestorb@bueninventario.com';
const INSTAGRAM_HANDLE = 'bueninventario';
const FACEBOOK_HANDLE = 'bueninventario';
const TIKTOK_URL = 'https://www.tiktok.com';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject?: string, body?: string): string {
  const base = `mailto:${EMAIL}`;
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return params.length ? `${base}?${params.join('&')}` : base;
}

export function instagramLink(): string {
  return `https://instagram.com/${INSTAGRAM_HANDLE}`;
}

export function facebookLink(): string {
  return `https://facebook.com/${FACEBOOK_HANDLE}`;
}

export function tiktokLink(): string {
  return TIKTOK_URL;
}

/**
 * Mensaje canónico para el botón "Solicitar demo" del Hero. Vive acá (no
 * inline en el componente) porque el copy de mensajes pre-poblados es
 * single-source-of-truth — si mañana se agrega el CTA en otra sección,
 * referenciar esta constante en vez de duplicar.
 */
export const DEMO_REQUEST_MESSAGE =
  'Hola Néstor, quiero agendar una demo de Buen Inventario. Me contás cómo es?';

export const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  email: EMAIL,
  instagram: INSTAGRAM_HANDLE,
  facebook: FACEBOOK_HANDLE,
  tiktok: TIKTOK_URL,
} as const;

const WHATSAPP_NUMBER = '5491122775850';
const EMAIL = 'hola@bueninventario.com';
const INSTAGRAM_HANDLE = 'bueninventario';

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

export const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  email: EMAIL,
  instagram: INSTAGRAM_HANDLE,
} as const;

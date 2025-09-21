import { Product } from './supabase/types';

// WhatsApp share utility functions
export const WHATSAPP_PHONE = '917991812899'; // Your WhatsApp business number

export interface WhatsAppShareData {
  product: Product;
}

export function generateWhatsAppMessage(data: WhatsAppShareData): string {
  const { product } = data;
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kabirclub.com';
  const productUrl = `${baseUrl}/product/${product.handle}`;
  
  let message = `Hi! I'm interested in this product. Please let me know about availability and delivery options.\n\n`;
  message += `Product link: ${productUrl}`;
  
  return message;
}

export function generateWhatsAppUrl(data: WhatsAppShareData): string {
  const message = generateWhatsAppMessage(data);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function shareOnWhatsApp(data: WhatsAppShareData): void {
  const url = generateWhatsAppUrl(data);
  
  if (typeof window !== 'undefined') {
    // Open in new tab/window
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}


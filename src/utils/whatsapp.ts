/**
 * Pure logic utilities for WhatsApp deep-linking and phone formatting
 */

export function cleanMozPhoneForWhatsApp(phone: string): string {
  if (!phone) return '258843129000';
  
  // Remove spaces, plus, hyphens, parentheses
  const digitsOnly = phone.replace(/[^0-9]/g, '');

  // If already starts with 258 and has 12 digits (258 + 9 digits)
  if (digitsOnly.startsWith('258') && digitsOnly.length >= 12) {
    return digitsOnly;
  }

  // If standard 9 digit Mozambican number (starts with 82, 83, 84, 85, 86, 87)
  if (digitsOnly.length === 9) {
    return `258${digitsOnly}`;
  }

  // Fallback if starts with 0 and followed by 9 digits
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `258${digitsOnly.slice(1)}`;
  }

  return digitsOnly.startsWith('258') ? digitsOnly : `258${digitsOnly}`;
}

export function buildWhatsAppChatUrl(phone: string, message: string): string {
  const cleanPhone = cleanMozPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export interface WhatsAppQuickOption {
  id: string;
  label: string;
  promptText: string;
}

export const WHATSAPP_QUICK_OPTIONS: WhatsAppQuickOption[] = [
  {
    id: 'geral',
    label: 'Informações Gerais',
    promptText: 'Olá TechVisions, gostaria de obter mais informações sobre as soluções e serviços para a minha empresa.',
  },
  {
    id: 'cotacao-software',
    label: 'Cotação de Software POS',
    promptText: 'Olá TechVisions, gostaria de solicitar uma cotação e demonstração de um software de faturação e ponto de venda.',
  },
  {
    id: 'material-escritorio',
    label: 'Material de Escritório',
    promptText: 'Olá, pretendo solicitar uma cotação para fornecimento de material de escritório, consumíveis e equipamentos de informática.',
  },
  {
    id: 'servidores-email',
    label: 'Servidores & Email Corporativo',
    promptText: 'Olá TechVisions, tenho interesse em configurar servidores de arquivos (offline/cloud) e email corporativo profissional (@empresa.co.mz).',
  },
  {
    id: 'gestao-stock',
    label: 'Gestão de Stock & Armazém',
    promptText: 'Olá, gostaria de agendar uma consulta sobre organização de armazém e auditoria de stock para a minha empresa.',
  },
];

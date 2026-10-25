/**
 * Formats a number to Mozambican Metical currency (MZN)
 */
export function formatMZN(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeAmount).replace('MTn', 'MZN');
}

/**
 * Validates Mozambican mobile numbers for M-Pesa (84, 85) and E-Mola (86, 87)
 */
export function validateMozPhone(input: string): {
  isValid: boolean;
  normalized: string;
  carrier?: 'Vodacom' | 'Movitel' | 'TMCEL' | 'Outro';
  supportedMethods: ('MPESA' | 'EMOLA')[];
  error?: string;
} {
  // Strip spaces, dashes, parentheses and country code
  let cleaned = input.replace(/\D/g, '');

  if (cleaned.startsWith('258')) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.length !== 9) {
    return {
      isValid: false,
      normalized: cleaned,
      supportedMethods: [],
      error: 'O número de celular em Moçambique deve conter 9 dígitos (ex: 84XXXXXXX)',
    };
  }

  const prefix = cleaned.slice(0, 2);

  if (prefix === '84' || prefix === '85') {
    return {
      isValid: true,
      normalized: `+258${cleaned}`,
      carrier: 'Vodacom',
      supportedMethods: ['MPESA'],
    };
  }

  if (prefix === '86' || prefix === '87') {
    return {
      isValid: true,
      normalized: `+258${cleaned}`,
      carrier: 'Movitel',
      supportedMethods: ['EMOLA'],
    };
  }

  if (prefix === '82' || prefix === '83') {
    return {
      isValid: true,
      normalized: `+258${cleaned}`,
      carrier: 'TMCEL',
      supportedMethods: [],
      error: 'TMCEL não suporta M-Pesa nem E-Mola. Por favor use Vodacom (84/85) ou Movitel (86/87)',
    };
  }

  return {
    isValid: false,
    normalized: cleaned,
    supportedMethods: [],
    error: 'Prefixo de operadora não reconhecido em Moçambique. Use 84/85 para M-Pesa ou 86/87 para E-Mola',
  };
}

/**
 * Calculates order subtotal, discount, and grand total
 */
export function calculateOrderSummary(
  items: Array<{ price: number; quantity?: number }>,
  discountPercent = 0
): {
  subtotal: number;
  discountAmount: number;
  total: number;
  itemCount: number;
} {
  const subtotal = items.reduce((sum, item) => {
    const qty = Math.max(1, item.quantity ?? 1);
    return sum + (item.price * qty);
  }, 0);

  const discount = Math.min(100, Math.max(0, discountPercent));
  const discountAmount = (subtotal * discount) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = items.reduce((sum, item) => sum + Math.max(1, item.quantity ?? 1), 0);

  return {
    subtotal,
    discountAmount,
    total,
    itemCount,
  };
}

/**
 * Generates an official license key for TechVisions systems
 */
export function generateLicenseKey(prefix = 'TV'): string {
  const chunk = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${chunk()}-${chunk()}-${chunk()}`;
}

/**
 * Generates an order number
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TV-MZ-${year}-${random}`;
}

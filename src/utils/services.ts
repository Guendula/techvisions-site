import { CompanyServiceItem } from '../types';

export interface ServiceValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateServiceItem(item: Partial<CompanyServiceItem>): ServiceValidationResult {
  const errors: string[] = [];

  if (!item.title || item.title.trim().length < 3) {
    errors.push('O título do serviço deve ter pelo menos 3 caracteres.');
  }

  if (!item.shortDescription || item.shortDescription.trim().length < 10) {
    errors.push('A descrição curta deve conter pelo menos 10 caracteres explicativos.');
  }

  if (!item.fullDescription || item.fullDescription.trim().length < 20) {
    errors.push('A descrição completa deve ter pelo menos 20 caracteres detalhando a solução.');
  }

  if (!item.category || item.category.trim().length === 0) {
    errors.push('A categoria do serviço é obrigatória.');
  }

  if (typeof item.order !== 'number' || item.order < 1) {
    errors.push('A ordem de exibição deve ser um número inteiro igual ou superior a 1.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function filterActiveServices(
  services: CompanyServiceItem[],
  selectedCategory: string = 'Todos',
  searchQuery: string = ''
): CompanyServiceItem[] {
  const query = searchQuery.trim().toLowerCase();

  return services
    .filter((s) => s.isActive)
    .filter((s) => {
      if (selectedCategory !== 'Todos' && s.category !== selectedCategory) {
        return false;
      }
      if (!query) return true;
      const titleMatch = s.title.toLowerCase().includes(query);
      const descMatch = s.shortDescription.toLowerCase().includes(query);
      const fullMatch = s.fullDescription.toLowerCase().includes(query);
      const featMatch = s.features.some((f) => f.toLowerCase().includes(query));
      const targetMatch = s.targetAudience?.toLowerCase().includes(query) ?? false;
      return titleMatch || descMatch || fullMatch || featMatch || targetMatch;
    })
    .sort((a, b) => a.order - b.order);
}

export function getServiceCategoryList(services: CompanyServiceItem[]): string[] {
  const categories = new Set<string>();
  services.forEach((s) => {
    if (s.category) categories.add(s.category);
  });
  return ['Todos', ...Array.from(categories)];
}

export function calculateServicesStats(services: CompanyServiceItem[]) {
  const total = services.length;
  const active = services.filter((s) => s.isActive).length;
  const inactive = total - active;
  const categories = new Set(services.map((s) => s.category));

  return {
    total,
    active,
    inactive,
    categoriesCount: categories.size,
  };
}

export function formatServiceWhatsAppMessage(params: {
  serviceTitle: string;
  clientName: string;
  clientPhone: string;
  companyName?: string;
  city?: string;
  urgency?: string;
  details?: string;
}): string {
  const lines: string[] = [
    `*SOLICITAÇÃO DE COTAÇÃO - TECHVISIONS MOÇAMBIQUE*`,
    ``,
    `*Serviço de Interesse:* ${params.serviceTitle}`,
    `*Nome do Solicitante:* ${params.clientName}`,
    `*Contacto / Telefone:* ${params.clientPhone}`,
  ];

  if (params.companyName) {
    lines.push(`*Empresa:* ${params.companyName}`);
  }

  if (params.city) {
    lines.push(`*Cidade / Localização:* ${params.city}`);
  }

  if (params.urgency) {
    const urgencyLabel: Record<string, string> = {
      imediata: 'Imediata (Urgente)',
      alta: 'Alta (Próximos dias)',
      media: 'Média (Esta semana)',
      baixa: 'Baixa (Apenas planeamento)',
    };
    lines.push(`*Nível de Urgência:* ${urgencyLabel[params.urgency] || params.urgency}`);
  }

  if (params.details && params.details.trim().length > 0) {
    lines.push(``);
    lines.push(`*Detalhes do Projeto / Necessidades:*`);
    lines.push(params.details.trim());
  }

  lines.push(``);
  lines.push(`_Mensagem gerada via portal TechVisions Moçambique_`);

  return lines.join('\n');
}

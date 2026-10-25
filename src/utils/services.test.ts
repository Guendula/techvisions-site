import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateServiceItem,
  filterActiveServices,
  getServiceCategoryList,
  calculateServicesStats,
  formatServiceWhatsAppMessage,
} from './services';
import { INITIAL_SERVICES } from '../data/initialServices';
import { CompanyServiceItem } from '../types';

describe('services utility unit tests', () => {
  it('validates a complete service item with no errors', () => {
    const valid = validateServiceItem(INITIAL_SERVICES[0]);
    assert.strictEqual(valid.valid, true);
    assert.strictEqual(valid.errors.length, 0);
  });

  it('rejects short title and short descriptions', () => {
    const invalid = validateServiceItem({
      title: 'Oi',
      shortDescription: 'curta',
      fullDescription: 'muito curta',
      category: '',
      order: 0,
    });

    assert.strictEqual(invalid.valid, false);
    assert.ok(invalid.errors.length >= 4);
    assert.ok(invalid.errors.some((e) => e.includes('título')));
    assert.ok(invalid.errors.some((e) => e.includes('descrição curta')));
    assert.ok(invalid.errors.some((e) => e.includes('categoria')));
    assert.ok(invalid.errors.some((e) => e.includes('ordem')));
  });

  it('filters active services by category and search keyword', () => {
    const mockServices: CompanyServiceItem[] = [
      {
        id: 's1',
        title: 'Venda de Material de Escritório',
        category: 'Escritório & Hardware',
        shortDescription: 'Papelaria e consumíveis',
        fullDescription: 'Descrição completa com toners e papel',
        icon: 'Briefcase',
        features: ['Toners', 'Papel A4'],
        pricingType: 'quote',
        isActive: true,
        order: 1,
      },
      {
        id: 's2',
        title: 'Servidores de Email e Arquivos',
        category: 'Servidores & Redes',
        shortDescription: 'NAS local e nuvem',
        fullDescription: 'Descrição de servidores offline e cloud',
        icon: 'Server',
        features: ['NAS local', 'Cloud'],
        pricingType: 'quote',
        isActive: true,
        order: 2,
      },
      {
        id: 's3',
        title: 'Serviço Inativo Descontinuado',
        category: 'Servidores & Redes',
        shortDescription: 'Inativo para testes',
        fullDescription: 'Descrição de teste inativo',
        icon: 'Server',
        features: ['Teste'],
        pricingType: 'quote',
        isActive: false,
        order: 3,
      },
    ];

    // Filter active only
    const activeOnly = filterActiveServices(mockServices, 'Todos', '');
    assert.strictEqual(activeOnly.length, 2);
    assert.strictEqual(activeOnly[0].id, 's1');
    assert.strictEqual(activeOnly[1].id, 's2');

    // Filter by category
    const serverCat = filterActiveServices(mockServices, 'Servidores & Redes', '');
    assert.strictEqual(serverCat.length, 1);
    assert.strictEqual(serverCat[0].id, 's2');

    // Filter by search query
    const searchToners = filterActiveServices(mockServices, 'Todos', 'toners');
    assert.strictEqual(searchToners.length, 1);
    assert.strictEqual(searchToners[0].id, 's1');
  });

  it('extracts unique categories including Todos', () => {
    const categories = getServiceCategoryList(INITIAL_SERVICES);
    assert.strictEqual(categories[0], 'Todos');
    assert.ok(categories.includes('Escritório & Hardware'));
    assert.ok(categories.includes('Servidores & Redes'));
    assert.ok(categories.includes('Comunicação Corporativa'));
    assert.ok(categories.includes('Software & Mobile'));
    assert.ok(categories.includes('Gestão & Consultoria'));
  });

  it('calculates services statistics correctly', () => {
    const stats = calculateServicesStats(INITIAL_SERVICES);
    assert.strictEqual(stats.total, 5);
    assert.strictEqual(stats.active, 5);
    assert.strictEqual(stats.inactive, 0);
    assert.strictEqual(stats.categoriesCount, 5);
  });

  it('formats professional WhatsApp message with all customer details', () => {
    const msg = formatServiceWhatsAppMessage({
      serviceTitle: 'Criação de Servidores de Email e de Arquivos',
      clientName: 'Armando Cossa',
      clientPhone: '+258 84 123 4567',
      companyName: 'Cossa & Filhos Lda',
      city: 'Maputo',
      urgency: 'imediata',
      details: 'Precisamos de servidor local para 15 computadores e backup em nuvem.',
    });

    assert.ok(msg.includes('Armando Cossa'));
    assert.ok(msg.includes('Cossa & Filhos Lda'));
    assert.ok(msg.includes('Criação de Servidores de Email e de Arquivos'));
    assert.ok(msg.includes('Imediata (Urgente)'));
    assert.ok(msg.includes('Precisamos de servidor local'));
    assert.ok(msg.includes('+258 84 123 4567'));
  });
});

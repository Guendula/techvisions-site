import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateSeoSettings,
  parseKeywordTags,
  calculateSeoScore,
  generateJsonLdSchema,
} from './seo';
import { SeoSettings } from '../types';

const mockValidSeo: SeoSettings = {
  metaTitle: 'TechVisions - Soluções Web & Mobile • Moçambique',
  metaDescription: 'Plataforma líder em sistemas comerciais e POS em Moçambique: padarias, mercearias, restaurantes e armazéns com faturação, M-Pesa e cartões.',
  keywords: 'software pos moçambique, sistemas comerciais maputo, pos padaria, faturação m-pesa, techvisions',
  author: 'TechVisions Moçambique',
  canonicalUrl: 'https://techvisions.co.mz',
  robotsIndex: true,
  robotsFollow: true,
  structuredDataEnabled: true,
};

describe('seo utility unit tests', () => {
  it('validates good SEO metadata with no errors', () => {
    const res = validateSeoSettings(mockValidSeo);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  it('rejects empty title or description', () => {
    const res = validateSeoSettings({
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    });
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.errors.length, 2);
  });

  it('extracts keyword tags correctly', () => {
    const tags = parseKeywordTags('pos maputo, m-pesa, pos padaria , m-pesa, gestão stock');
    assert.strictEqual(tags.length, 4);
    assert.ok(tags.includes('pos maputo'));
    assert.ok(tags.includes('m-pesa'));
    assert.ok(tags.includes('pos padaria'));
    assert.ok(tags.includes('gestão stock'));
  });

  it('calculates SEO score and gives Excelente for complete metadata', () => {
    const audit = calculateSeoScore(mockValidSeo);
    assert.ok(audit.score >= 80);
    assert.strictEqual(audit.grade, 'Excelente');
    assert.strictEqual(audit.checks.length, 6);
  });

  it('generates valid Schema.org JSON-LD string', () => {
    const jsonStr = generateJsonLdSchema(mockValidSeo);
    const parsed = JSON.parse(jsonStr);
    assert.strictEqual(parsed['@context'], 'https://schema.org');
    assert.strictEqual(parsed['@type'], 'WebApplication');
    assert.strictEqual(parsed.name, mockValidSeo.metaTitle);
  });
});

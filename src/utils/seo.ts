import { SeoSettings } from '../types';

export interface SeoValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SeoScoreAudit {
  score: number;
  grade: 'Excelente' | 'Bom' | 'Precisa Melhorar';
  checks: {
    label: string;
    passed: boolean;
    recommendation: string;
  }[];
}

/**
 * Validates SEO settings fields
 */
export function validateSeoSettings(seo: Partial<SeoSettings>): SeoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const title = seo.metaTitle?.trim() || '';
  if (title.length < 5) {
    errors.push('O Meta Título é obrigatório e deve ter pelo menos 5 caracteres.');
  } else if (title.length < 30) {
    warnings.push('O título tem menos de 30 caracteres. Títulos entre 40 e 60 caracteres têm melhor CTR no Google.');
  } else if (title.length > 70) {
    warnings.push('O título ultrapassa 70 caracteres e pode ser cortado nos snippets de pesquisa.');
  }

  const desc = seo.metaDescription?.trim() || '';
  if (desc.length < 10) {
    errors.push('A Meta Descrição é obrigatória e deve ter pelo menos 10 caracteres.');
  } else if (desc.length < 80) {
    warnings.push('A descrição é curta. Google recomenda entre 120 e 160 caracteres para snippets ideais.');
  } else if (desc.length > 170) {
    warnings.push('A descrição ultrapassa 160 caracteres e será truncada no Google.');
  }

  const keywords = seo.keywords?.trim() || '';
  if (keywords.length < 3) {
    warnings.push('Adicione palavras-chave separadas por vírgula para reforçar os termos de busca relevantes.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Extracts clean unique keyword tags from comma-separated string
 */
export function parseKeywordTags(keywords: string): string[] {
  if (!keywords) return [];
  return Array.from(
    new Set(
      keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    )
  );
}

/**
 * Calculates SEO Health Score & Audit Checklist
 */
export function calculateSeoScore(seo: SeoSettings): SeoScoreAudit {
  const checks = [
    {
      label: 'Comprimento do Meta Título (30 a 65 caracteres)',
      passed: seo.metaTitle.length >= 30 && seo.metaTitle.length <= 65,
      recommendation: `Atual: ${seo.metaTitle.length} chars. Ideal: 40-60 caracteres.`,
    },
    {
      label: 'Comprimento da Meta Descrição (100 a 160 caracteres)',
      passed: seo.metaDescription.length >= 100 && seo.metaDescription.length <= 165,
      recommendation: `Atual: ${seo.metaDescription.length} chars. Ideal: 120-160 caracteres.`,
    },
    {
      label: 'Palavras-chave Relevantes (Mínimo de 4 termos)',
      passed: parseKeywordTags(seo.keywords).length >= 4,
      recommendation: `Atual: ${parseKeywordTags(seo.keywords).length} termos. Adicione pelo menos 4 termos-chave.`,
    },
    {
      label: 'Localização Geográfica (Menção a Moçambique / Maputo)',
      passed:
        /mo[çc]ambique|maputo|matola/i.test(seo.metaTitle) ||
        /mo[çc]ambique|maputo|matola/i.test(seo.metaDescription) ||
        /mo[çc]ambique|maputo|matola/i.test(seo.keywords),
      recommendation: 'Inclua termos locais como Moçambique ou Maputo para ranking local.',
    },
    {
      label: 'Termos de Pagamento e Negócio (POS / Gestão / M-Pesa)',
      passed:
        /pos|gest[ãa]o|m-pesa|loja|sistema/i.test(seo.metaTitle) ||
        /pos|gest[ãa]o|m-pesa|loja|sistema/i.test(seo.metaDescription),
      recommendation: 'Inclua palavras comerciais de alto volume como POS, Gestão ou M-Pesa.',
    },
    {
      label: 'URL Canónica e Indexação Robôs Ativas',
      passed: Boolean(seo.canonicalUrl && seo.robotsIndex && seo.robotsFollow),
      recommendation: 'Mantenha robots.txt com index/follow ativo para motores de busca.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  let grade: 'Excelente' | 'Bom' | 'Precisa Melhorar' = 'Precisa Melhorar';
  if (score >= 80) grade = 'Excelente';
  else if (score >= 50) grade = 'Bom';

  return {
    score,
    grade,
    checks,
  };
}

/**
 * Generates Schema.org WebApplication structured data JSON
 */
export function generateJsonLdSchema(seo: SeoSettings): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seo.metaTitle,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android, Windows',
    description: seo.metaDescription,
    keywords: seo.keywords,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MZN',
      lowPrice: '14900',
      highPrice: '45000',
      offerCount: '10',
    },
  };
  return JSON.stringify(schema, null, 2);
}

/**
 * Updates DOM head tags in real-time
 */
export function applySeoToDom(seo: SeoSettings): void {
  if (typeof document === 'undefined') return;

  // 1. Title
  if (seo.metaTitle) {
    document.title = seo.metaTitle;
  }

  // 2. Helper to set or create meta tag
  const setMeta = (nameAttr: string, nameValue: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${nameValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, nameValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Description
  if (seo.metaDescription) {
    setMeta('name', 'description', seo.metaDescription);
    setMeta('property', 'og:description', seo.metaDescription);
    setMeta('name', 'twitter:description', seo.metaDescription);
  }

  // 4. Title in social
  if (seo.metaTitle) {
    setMeta('property', 'og:title', seo.metaTitle);
    setMeta('name', 'twitter:title', seo.metaTitle);
  }

  // 5. Keywords
  if (seo.keywords) {
    setMeta('name', 'keywords', seo.keywords);
  }

  // 6. Robots
  const robots = `${seo.robotsIndex !== false ? 'index' : 'noindex'}, ${
    seo.robotsFollow !== false ? 'follow' : 'nofollow'
  }`;
  setMeta('name', 'robots', robots);

  // 7. Canonical link
  if (seo.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonicalUrl);
  }

  // 8. Structured Data JSON-LD
  if (seo.structuredDataEnabled !== false) {
    let ldScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = generateJsonLdSchema(seo);
  }
}

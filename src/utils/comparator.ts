import { SystemProduct } from '../types';

export const MAX_COMPARE_ITEMS = 3;

export function canAddToComparison(
  selectedIds: string[],
  idToAdd: string,
  max = MAX_COMPARE_ITEMS
): { allowed: boolean; reason?: string } {
  if (selectedIds.includes(idToAdd)) {
    return { allowed: false, reason: 'Este sistema já está selecionado para comparação.' };
  }
  if (selectedIds.length >= max) {
    return {
      allowed: false,
      reason: `Pode comparar no máximo ${max} sistemas em simultâneo. Remova um para adicionar outro.`,
    };
  }
  return { allowed: true };
}

export interface MatrixRow {
  label: string;
  category: 'core' | 'hardware' | 'feature';
  values: Record<string, boolean | string>;
}

export function buildComparisonMatrix(systems: SystemProduct[]): MatrixRow[] {
  if (!systems.length) return [];

  // Common relevant commercial hardware in Mozambique
  const allHardware = [
    'Impressora Térmica 58/80mm',
    'Gaveta de Dinheiro',
    'Balança Digital',
    'Leitor Código de Barras',
    'Dispositivos Móveis',
    'Ecrã de Cozinha (KDS)',
  ];

  // Core feature benchmarks
  const benchmarkFeatures = [
    { label: 'Modo 100% Offline (Sem Internet)', key: 'offline' },
    { label: 'Aplicação Mobile (Android / Tablet)', key: 'mobile' },
    { label: 'Sincronização em Nuvem (Multi-Loja)', key: 'cloud' },
    { label: 'Emissão de Talão e Fatura Fiscal', key: 'invoice' },
    { label: 'Gestão de Fiado / Crédito a Clientes', key: 'credit' },
    { label: 'Controlo de Matéria-Prima / Ingredientes', key: 'recipe' },
    { label: 'Controlo de Mesas e Comandas', key: 'tables' },
    { label: 'Gestão de Múltiplos Caixas', key: 'multicaixa' },
  ];

  const rows: MatrixRow[] = [];

  // Hardware rows
  allHardware.forEach((hw) => {
    const values: Record<string, boolean> = {};
    systems.forEach((sys) => {
      const supports =
        sys.specs?.hardwareSupport?.some((h) =>
          h.toLowerCase().includes(hw.toLowerCase()) || hw.toLowerCase().includes(h.toLowerCase())
        ) ?? false;
      values[sys.id] = supports;
    });
    rows.push({
      label: hw,
      category: 'hardware',
      values,
    });
  });

  // Feature rows
  benchmarkFeatures.forEach((bm) => {
    const values: Record<string, boolean> = {};
    systems.forEach((sys) => {
      let matches = false;
      if (bm.key === 'offline') matches = !!sys.specs?.offlineMode;
      else if (bm.key === 'mobile') matches = !!sys.isMobileSupported;
      else if (bm.key === 'cloud') matches = !!sys.isCloudSupported;
      else if (bm.key === 'invoice') matches = true; // All systems support receipts/invoicing
      else if (bm.key === 'credit') {
        matches = sys.category === 'Mercearia' || sys.category === 'Ferragens' || sys.features.some(f => f.toLowerCase().includes('fiado') || f.toLowerCase().includes('crédito'));
      } else if (bm.key === 'recipe') {
        matches = sys.category === 'Padaria' || sys.category === 'Restaurante & Bar' || sys.features.some(f => f.toLowerCase().includes('receita') || f.toLowerCase().includes('farinha'));
      } else if (bm.key === 'tables') {
        matches = sys.category === 'Restaurante & Bar';
      } else if (bm.key === 'multicaixa') {
        matches = sys.category === 'Supermercado' || sys.price >= 25000;
      }
      values[sys.id] = matches;
    });

    rows.push({
      label: bm.label,
      category: 'feature',
      values,
    });
  });

  return rows;
}

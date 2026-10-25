import React, { useState } from 'react';
import { SystemProduct } from '../types';
import { formatMZN } from '../utils/pricing';
import { buildComparisonMatrix } from '../utils/comparator';
import {
  X,
  Check,
  Minus,
  ExternalLink,
  ShoppingCart,
  Plus,
  GitCompare,
  Sparkles,
  HelpCircle,
  Printer,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SystemsComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSystems: SystemProduct[];
  allSystems: SystemProduct[];
  onAddSystem: (system: SystemProduct) => void;
  onRemoveSystem: (id: string) => void;
  onOpenDemo: (system: SystemProduct) => void;
  onAddToCart: (system: SystemProduct) => void;
}

export const SystemsComparatorModal: React.FC<SystemsComparatorModalProps> = ({
  isOpen,
  onClose,
  selectedSystems,
  allSystems,
  onAddSystem,
  onRemoveSystem,
  onOpenDemo,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'hardware' | 'feature'>('all');

  // Matrix rows computed dynamically
  const matrixRows = buildComparisonMatrix(selectedSystems);
  const hardwareRows = matrixRows.filter((r) => r.category === 'hardware');
  const featureRows = matrixRows.filter((r) => r.category === 'feature');

  // Available systems to add to slots
  const unselectedSystems = allSystems.filter(
    (s) => !selectedSystems.some((sel) => sel.id === s.id)
  );

  const presets = [
    { name: 'Padaria vs Mercearia', ids: ['tv-sys-padaria', 'tv-sys-mercearia'] },
    { name: 'Mercearia vs Supermercado', ids: ['tv-sys-mercearia', 'tv-sys-supermercado'] },
    { name: 'Restaurante vs Serviços', ids: ['tv-sys-restaurante', 'tv-sys-servicos'] },
  ];

  const handleApplyPreset = (ids: string[]) => {
    const toSelect = allSystems.filter((s) => ids.includes(s.id));
    // Clear and set
    selectedSystems.forEach((s) => onRemoveSystem(s.id));
    toSelect.forEach((s) => onAddSystem(s));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Fechar comparador"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              Comparador de Sistemas TechVisions
            </span>
            <span className="text-xs text-slate-300">
              Confronto direto de até 3 softwares
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Tabela Comparativa de Funcionalidades &amp; Hardware
          </h2>
          <p className="text-blue-100 text-xs mt-1 max-w-2xl">
            Compare preços de licença, recursos técnicos e compatibilidade com impressoras térmicas, gavetas e balanças para escolher o software ideal para a sua empresa em Moçambique.
          </p>

          {/* Quick Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-300 font-semibold">Comparações rápidas:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(p.ids)}
                className="text-[11px] px-2.5 py-1 bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-lg border border-white/10 transition"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body / Comparison Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          {selectedSystems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <GitCompare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-sm">Nenhum sistema selecionado</h3>
              <p className="text-xs text-gray-500 mt-1">
                Escolha até três sistemas no catálogo para confrontar recursos lado a lado.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                {/* Column Headers: System details */}
                <thead>
                  <tr className="border-b bg-slate-50/80">
                    <th className="p-4 w-1/4 align-top text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      Critério / Especificação
                    </th>
                    {selectedSystems.map((sys) => (
                      <th key={sys.id} className="p-4 w-1/4 align-top border-l border-gray-100">
                        <div className="space-y-2">
                          <div className="relative">
                            <img
                              src={sys.imageUrl}
                              alt={sys.title}
                              className="w-full h-24 object-cover rounded-xl"
                            />
                            <button
                              onClick={() => onRemoveSystem(sys.id)}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition"
                              title="Remover da comparação"
                              aria-label={`Remover ${sys.title}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                              {sys.category}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 mt-1 line-clamp-1">
                              {sys.title}
                            </h4>
                            <p className="text-base font-black text-blue-950 mt-0.5">
                              {formatMZN(sys.price)}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              onClick={() => onOpenDemo(sys)}
                              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onAddToCart(sys)}
                              className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Comprar</span>
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: 3 - selectedSystems.length }).map((_, idx) => (
                      <th
                        key={`empty-${idx}`}
                        className="p-4 w-1/4 align-top border-l border-dashed border-gray-200 bg-slate-50/40 text-center"
                      >
                        <div className="h-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4">
                          <Plus className="w-8 h-8 text-gray-300 mb-2" />
                          <span className="text-xs font-bold text-gray-700 mb-2">
                            Slot de Comparação Livre
                          </span>
                          {unselectedSystems.length > 0 ? (
                            <select
                              onChange={(e) => {
                                const found = allSystems.find((s) => s.id === e.target.value);
                                if (found) onAddSystem(found);
                              }}
                              defaultValue=""
                              className="w-full text-[11px] px-2 py-1.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                            >
                              <option value="" disabled>
                                + Adicionar Sistema...
                              </option>
                              {unselectedSystems.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.title} ({formatMZN(s.price)})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[10px] text-gray-400">Todos adicionados</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody className="divide-y divide-gray-100">
                  {/* Category Header: Especificações Gerais */}
                  <tr className="bg-slate-100/70 font-bold text-gray-800 text-[11px]">
                    <td colSpan={4} className="p-3 uppercase tracking-wider text-blue-900">
                      1. Plataforma &amp; Licenciamento
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-gray-700">Plataformas Suportadas</td>
                    {selectedSystems.map((sys) => (
                      <td key={sys.id} className="p-3.5 border-l border-gray-100 text-gray-800">
                        {sys.specs?.platform || 'Web, Android Mobile, Windows'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedSystems.length }).map((_, i) => (
                      <td key={i} className="p-3.5 border-l border-dashed border-gray-100 text-gray-300 text-center">-</td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-3.5 font-semibold text-gray-700">Tipo de Licença</td>
                    {selectedSystems.map((sys) => (
                      <td key={sys.id} className="p-3.5 border-l border-gray-100 font-bold text-emerald-700">
                        Vitalícia (Sem Mensalidades Obrigatórias)
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedSystems.length }).map((_, i) => (
                      <td key={i} className="p-3.5 border-l border-dashed border-gray-100 text-gray-300 text-center">-</td>
                    ))}
                  </tr>

                  {/* Category Header: Compatibilidade de Hardware */}
                  <tr className="bg-slate-100/70 font-bold text-gray-800 text-[11px]">
                    <td colSpan={4} className="p-3 uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Compatibilidade de Hardware Comercial em Moçambique</span>
                    </td>
                  </tr>

                  {hardwareRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 text-gray-700 font-medium">{row.label}</td>
                      {selectedSystems.map((sys) => {
                        const val = row.values[sys.id];
                        return (
                          <td key={sys.id} className="p-3.5 border-l border-gray-100 text-center">
                            {val ? (
                              <div className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                <span>Suportado</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center text-gray-400">
                                <Minus className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: 3 - selectedSystems.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-l border-dashed border-gray-100 text-gray-300 text-center">-</td>
                      ))}
                    </tr>
                  ))}

                  {/* Category Header: Funcionalidades */}
                  <tr className="bg-slate-100/70 font-bold text-gray-800 text-[11px]">
                    <td colSpan={4} className="p-3 uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>3. Recursos Comerciais &amp; Funcionalidades</span>
                    </td>
                  </tr>

                  {featureRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 text-gray-700 font-medium">{row.label}</td>
                      {selectedSystems.map((sys) => {
                        const val = row.values[sys.id];
                        return (
                          <td key={sys.id} className="p-3.5 border-l border-gray-100 text-center">
                            {val ? (
                              <div className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                <span>Sim</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center text-gray-400">
                                <Minus className="w-4 h-4" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                      {Array.from({ length: 3 - selectedSystems.length }).map((_, i) => (
                        <td key={i} className="p-3.5 border-l border-dashed border-gray-100 text-gray-300 text-center">-</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-gray-500">
            Dúvidas na escolha? Teste a demonstração interativa ou consulte o nosso assistente com Google Maps.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition"
          >
            Fechar Comparador
          </button>
        </div>
      </div>
    </div>
  );
};

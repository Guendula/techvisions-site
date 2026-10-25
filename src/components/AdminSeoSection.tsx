import React, { useState } from 'react';
import { SeoSettings } from '../types';
import {
  validateSeoSettings,
  calculateSeoScore,
  parseKeywordTags,
  generateJsonLdSchema,
} from '../utils/seo';
import { INITIAL_SEO_SETTINGS } from '../data/initialSeo';
import {
  Search,
  Globe,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ExternalLink,
  ShieldCheck,
  Check,
  Smartphone,
  Laptop,
  HelpCircle,
  Tag,
  Zap,
} from 'lucide-react';

interface AdminSeoSectionProps {
  seoSettings: SeoSettings;
  onUpdateSeoSettings: (settings: SeoSettings) => void;
}

export const AdminSeoSection: React.FC<AdminSeoSectionProps> = ({
  seoSettings,
  onUpdateSeoSettings,
}) => {
  const [form, setForm] = useState<SeoSettings>(seoSettings);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showJsonLdModal, setShowJsonLdModal] = useState(false);

  // Suggested keywords tailored to commerce in Mozambique
  const suggestedKeywords = [
    'software pos moçambique',
    'sistema de facturação maputo',
    'programa de caixa matola',
    'pos padaria mozambique',
    'sistema mercearia fiado',
    'pagamentos m-pesa vodacom',
    'e-mola movitel pos',
    'equipamento pos fiscal',
    'sistema comercial offline',
    'gestão de stock e armazém',
  ];

  const validation = validateSeoSettings(form);
  const audit = calculateSeoScore(form);
  const keywordTags = parseKeywordTags(form.keywords);

  const handleAddKeyword = (kw: string) => {
    if (keywordTags.includes(kw)) return;
    const updated = form.keywords ? `${form.keywords}, ${kw}` : kw;
    setForm({ ...form, keywords: updated });
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    const remaining = keywordTags.filter((k) => k.toLowerCase() !== kwToRemove.toLowerCase());
    setForm({ ...form, keywords: remaining.join(', ') });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validation.valid) {
      alert(`Erros na validação SEO: ${validation.errors.join(' ')}`);
      return;
    }

    onUpdateSeoSettings(form);
    setSavedToast('Configurações SEO gravadas com sucesso! Meta tags e título sincronizados no Google/DOM.');
    setTimeout(() => {
      setSavedToast(null);
    }, 4000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar as configurações SEO recomendadas para Moçambique?')) {
      setForm(INITIAL_SEO_SETTINGS);
      onUpdateSeoSettings(INITIAL_SEO_SETTINGS);
      setSavedToast('Configurações SEO restauradas para os padrões recomendados.');
      setTimeout(() => setSavedToast(null), 3500);
    }
  };

  // Character length indicators
  const titleLen = form.metaTitle.length;
  const isTitleIdeal = titleLen >= 40 && titleLen <= 65;

  const descLen = form.metaDescription.length;
  const isDescIdeal = descLen >= 115 && descLen <= 165;

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wide border border-emerald-500/30">
              Otimização nos Motores de Busca
            </span>
            <span className="text-gray-400 text-[11px]">• Google, Bing &amp; Redes Sociais</span>
          </div>
          <h2 className="text-xl font-black text-white">Configurações SEO do TechVisions</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Personalize o <strong>Meta Título</strong>, a <strong>Meta Descrição</strong> e as <strong>Palavras-Chave (Keywords)</strong> para destacar o catálogo do TechVisions nas pesquisas de comerciantes e lojistas em Moçambique.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-2xl flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configurações SEO</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{savedToast}</span>
          </div>
          <button
            onClick={() => setSavedToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Grid: Form on Left (2 cols), SERP Preview & Audit on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Metadados Principais de Indexação</h3>
                <p className="text-[11px] text-gray-400">
                  Valores injetados no &lt;head&gt; do HTML e lidos pelos robots de indexação do Google.
                </p>
              </div>
              <Globe className="w-5 h-5 text-blue-600" />
            </div>

            {/* Field 1: Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <span>Meta Título (Page Title &amp; og:title) *</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isTitleIdeal
                        ? 'bg-emerald-100 text-emerald-800'
                        : titleLen < 40
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {titleLen} / 60 caracteres ({isTitleIdeal ? 'Ideal' : titleLen < 40 ? 'Curto' : 'Longo'})
                  </span>
                </div>
              </div>

              <input
                type="text"
                required
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="Ex: TechVisions - Soluções Web & Mobile • Moçambique"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-xs text-gray-900"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Aparece na aba do navegador, no link azul de resultados do Google e ao partilhar no WhatsApp/Facebook.
              </p>
            </div>

            {/* Field 2: Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <span>Meta Descrição (Description &amp; og:description) *</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isDescIdeal
                        ? 'bg-emerald-100 text-emerald-800'
                        : descLen < 115
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {descLen} / 160 caracteres ({isDescIdeal ? 'Ideal' : descLen < 115 ? 'Curta' : 'Longa'})
                  </span>
                </div>
              </div>

              <textarea
                rows={3}
                required
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="Descreva em 1-2 frases o que a aplicação faz, os negócios atendidos e a vantagem para os comerciantes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900 leading-relaxed"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Apresentada abaixo do título nas pesquisas orgânicas. Deve incentivar o comerciante a clicar no site.
              </p>
            </div>

            {/* Field 3: Keywords */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Palavras-Chave (Meta Keywords)</span>
                </label>
                <span className="text-[10px] font-bold text-gray-500">
                  {keywordTags.length} {keywordTags.length === 1 ? 'termo' : 'termos'} adicionados
                </span>
              </div>

              <textarea
                rows={2}
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="Separe as palavras-chave por vírgulas (ex: software pos maputo, pos padaria, faturacao m-pesa)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900 font-mono"
              />

              {/* Active Keyword Pills */}
              {keywordTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 p-2 bg-slate-50 rounded-xl border border-gray-100">
                  {keywordTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center gap-1 group"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(tag)}
                        className="text-blue-500 hover:text-red-600 transition"
                        title="Remover termo"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestion Chips */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Sugestões Rápidas para o Comércio de Moçambique (Clique para adicionar):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedKeywords.map((sug, idx) => {
                    const isAdded = keywordTags.includes(sug);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddKeyword(sug)}
                        disabled={isAdded}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition flex items-center gap-1 ${
                          isAdded
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 text-blue-700 border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span>{isAdded ? '✓' : '+'}</span>
                        <span>{sug}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Advanced SEO Options */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-gray-900 text-xs">Parâmetros Técnicos &amp; Robôs de Indexação</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">URL Canónica (Canonical URL)</label>
                  <input
                    type="url"
                    value={form.canonicalUrl}
                    onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                    placeholder="https://techvisions.co.mz"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Autor / Proprietário Legal</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="TechVisions Moçambique, Lda"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.robotsIndex !== false}
                    onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-[11px] text-gray-800">Indexar (index)</strong>
                    <span className="text-[10px] text-gray-400">Permitir robôs no Google</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.robotsFollow !== false}
                    onChange={(e) => setForm({ ...form, robotsFollow: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-[11px] text-gray-800">Seguir Links (follow)</strong>
                    <span className="text-[10px] text-gray-400">Rastrear links do site</span>
                  </div>
                </label>

                <label className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.structuredDataEnabled !== false}
                    onChange={(e) => setForm({ ...form, structuredDataEnabled: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <strong className="block text-[11px] text-gray-800">Schema.org JSON-LD</strong>
                    <span className="text-[10px] text-gray-400">Rich Snippets no Google</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowJsonLdModal(true)}
                  className="text-blue-600 hover:text-blue-800 font-bold text-[11px] flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Ver Schema.org JSON-LD Gerado</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Search SERP Snippet Preview & SEO Score */}
        <div className="space-y-6">
          {/* SERP Preview Box */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Pré-visualização no Google</span>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${
                    previewDevice === 'desktop' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-400'
                  }`}
                  title="Versão Desktop"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${
                    previewDevice === 'mobile' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-400'
                  }`}
                  title="Versão Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Google Search Result */}
            <div
              className={`p-4 bg-white rounded-2xl border border-gray-200 space-y-1.5 transition ${
                previewDevice === 'mobile' ? 'max-w-[280px] mx-auto text-[11px]' : ''
              }`}
            >
              {/* Google URL Line */}
              <div className="flex items-center gap-2 text-[11px] text-gray-600 truncate">
                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                  T
                </div>
                <div className="truncate">
                  <span className="font-semibold text-gray-800">techvisions.co.mz</span>
                  <span className="text-gray-400 text-[10px]"> › catalogo › pos-mocambique</span>
                </div>
              </div>

              {/* Title Link */}
              <h4 className="text-blue-800 hover:underline font-medium text-sm leading-snug cursor-pointer line-clamp-2">
                {form.metaTitle || 'TechVisions - Soluções Web & Mobile'}
              </h4>

              {/* Description Snippet */}
              <p className="text-gray-600 text-[11px] leading-relaxed line-clamp-3">
                {form.metaDescription ||
                  'Catálogo de softwares comerciais e sistemas POS em Moçambique com faturação, M-Pesa e suporte offline.'}
              </p>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
              Simulação de como o snippet aparecerá nos resultados de busca do Google.
            </p>
          </div>

          {/* SEO Health Audit Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-xs">Auditoria de Saúde SEO</h4>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                  audit.grade === 'Excelente'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {audit.score}% • {audit.grade}
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {audit.checks.map((chk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  {chk.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={chk.passed ? 'text-gray-200' : 'text-amber-200 font-semibold'}>
                      {chk.label}
                    </span>
                    <p className="text-[10px] text-gray-400">{chk.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30 text-xs active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Aplicar &amp; Guardar no Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON-LD Modal */}
      {showJsonLdModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-800 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Código Schema.org (JSON-LD) Injetado no &lt;head&gt;</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowJsonLdModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-72">
              {generateJsonLdSchema(form)}
            </pre>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-gray-400">
              <span>Este schema WebApplication qualifica o site para resultados enriquecidos no Google Search.</span>
              <button
                type="button"
                onClick={() => setShowJsonLdModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

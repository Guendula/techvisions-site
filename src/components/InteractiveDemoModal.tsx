import React, { useState } from 'react';
import { SystemProduct } from '../types';
import { formatMZN } from '../utils/pricing';
import {
  X,
  ExternalLink,
  Printer,
  CheckCircle,
  Plus,
  Trash2,
  Coffee,
  ShoppingBag,
  Store,
  Layers,
  Sparkles,
} from 'lucide-react';

interface InteractiveDemoModalProps {
  system: SystemProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (system: SystemProduct) => void;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  system,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !system) return null;

  // Simulator state
  const [activeTab, setActiveTab] = useState<'simulator' | 'specs'>('simulator');
  const [posCart, setPosCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Artigo Demonstração 1', price: 150, qty: 2 },
    { name: 'Artigo Demonstração 2', price: 450, qty: 1 },
  ]);
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  const [selectedTable, setSelectedTable] = useState('Mesa 04 (Esplanada)');
  const [clientFiadoName, setClientFiadoName] = useState('Dona Maria (Conta Fiado)');

  // Preset demo goods based on system category
  const getDemoPresets = () => {
    switch (system.category) {
      case 'Padaria':
        return [
          { name: 'Pão de Carcaça (Unidade)', price: 12 },
          { name: 'Pão Doce Tradicional', price: 20 },
          { name: 'Bolo de Aniversário Recheado', price: 950 },
          { name: 'Pastel de Nata Fresco', price: 65 },
          { name: 'Saco Farinha Trigo 50kg (Matéria Prima)', price: 1850 },
        ];
      case 'Mercearia':
      case 'Supermercado':
        return [
          { name: 'Arroz Dona Ana 25kg', price: 1350 },
          { name: 'Óleo de Cozinha 5 Litros', price: 680 },
          { name: 'Açúcar Castelo 1kg', price: 85 },
          { name: 'Sabão em Barra Omo', price: 140 },
          { name: 'Refrigerante Coca-Cola 2L', price: 110 },
        ];
      case 'Restaurante & Bar':
        return [
          { name: 'Cerveja 2M 330ml (Gelada)', price: 90 },
          { name: 'Frango Grelhado à Zambeziana', price: 480 },
          { name: 'Camarão Tigre na Brasa', price: 850 },
          { name: 'Laurentina Preta Long Neck', price: 100 },
          { name: 'Água Mineral da Namaacha 500ml', price: 50 },
        ];
      case 'Ferragens':
      case 'Gestão de Stock & Armazém':
        return [
          { name: 'Saco Cimento Limpopo 42.5N', price: 420 },
          { name: 'Varão de Ferro 12mm (Barra 12m)', price: 650 },
          { name: 'Lata Tinta Acrílica Coral 20L', price: 3400 },
          { name: 'Tubo PVC 110mm Esgoto', price: 380 },
          { name: 'Parafuso Philips 5x50 (Caixa 100un)', price: 220 },
        ];
      case 'Loja de Roupas':
        return [
          { name: 'Camisa Casual Linho (Tamanho M / Azul)', price: 1450 },
          { name: 'Calça Jeans Slim (Tamanho 42)', price: 1850 },
          { name: 'Vestido Estampado Floral (Tamanho S)', price: 2200 },
          { name: 'Sapatilhas Desportivas (Nº 41)', price: 3100 },
        ];
      default:
        return [
          { name: 'Ordem de Serviço #1042', price: 1200 },
          { name: 'Substituição de Peça Técnica', price: 850 },
          { name: 'Fatura Proforma Fiscal', price: 2500 },
        ];
    }
  };

  const demoItems = getDemoPresets();

  const handleAddItem = (item: { name: string; price: number }) => {
    setReceiptPrinted(false);
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveItem = (name: string) => {
    setPosCart((prev) => prev.filter((i) => i.name !== name));
  };

  const posTotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Fechar janela"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500/30 text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              {system.category}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Simulador Interativo Ativo
            </span>
          </div>
          <h2 className="text-2xl font-bold">{system.title}</h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl line-clamp-2">
            {system.description}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`pb-2 border-b-2 transition ${
                activeTab === 'simulator'
                  ? 'border-white text-white'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              Simulador Ponto de Venda (POS)
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 border-b-2 transition ${
                activeTab === 'specs'
                  ? 'border-white text-white'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              Especificações & Módulos
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {activeTab === 'simulator' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Panel: Catalogo de Teste */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-blue-600" />
                    Toque nos artigos para lançar na venda:
                  </h3>
                  <span className="text-xs text-gray-500">Modo Balcão Moçambique</span>
                </div>

                {system.category === 'Restaurante & Bar' && (
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-700">Mesa:</span>
                    {['Mesa 01', 'Mesa 04 (Esplanada)', 'Balcão Bar', 'VIP 02'].map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedTable(tbl)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          selectedTable === tbl
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {demoItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddItem(item)}
                      className="bg-white p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left flex flex-col justify-between group active:scale-95"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">
                          {item.name}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition shrink-0 ml-1">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-blue-900 mt-2">
                        {formatMZN(item.price)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Fiado simulation for Mercearia */}
                {system.category === 'Mercearia' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Módulo de Caderno de Crédito (Fiado):</span>
                      <p className="text-amber-700 text-[11px]">
                        Atribuído a: <span className="underline font-semibold">{clientFiadoName}</span>
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        alert(`Conta de fiado de ${clientFiadoName} atualizada com saldo pendente de ${formatMZN(posTotal)}!`)
                      }
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition"
                    >
                      Lançar Fiado
                    </button>
                  </div>
                )}
              </div>

              {/* Right Panel: Caixa & Talão Térmico */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Terminal de Caixa #{system.category}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Operador: Caixa 01
                    </span>
                  </div>

                  {posCart.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Nenhum artigo adicionado.<br />Clique nos produtos ao lado para simular.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                      {posCart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100">
                          <div className="flex-1 pr-2">
                            <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-gray-400 text-[11px]">
                              {item.qty}x @ {formatMZN(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {formatMZN(item.price * item.qty)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.name)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="flex items-center justify-between text-base font-extrabold text-blue-950 mb-3">
                    <span>Total da Venda:</span>
                    <span>{formatMZN(posTotal)}</span>
                  </div>

                  {receiptPrinted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-800 mb-2">
                      <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                      Talão de Venda e Recibo Fiscal impresso com sucesso!
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReceiptPrinted(true)}
                      disabled={posCart.length === 0}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Simular Talão
                    </button>
                    <button
                      onClick={() => {
                        setPosCart([]);
                        setReceiptPrinted(false);
                      }}
                      className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      Limpar Caixa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Funcionalidades Incluídas:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {system.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {system.specs && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Requisitos e Compatibilidade Técnica:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-1">Plataformas:</span>
                      <span className="font-semibold text-gray-800">{system.specs.platform}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Modo Offline:</span>
                      <span className="font-semibold text-emerald-600">
                        {system.specs.offlineMode ? '100% Suportado' : 'Requer Conexão'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Hardware:</span>
                      <span className="font-semibold text-gray-800">
                        {system.specs.hardwareSupport.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Idioma:</span>
                      <span className="font-semibold text-gray-800">
                        {system.specs.languages.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-500 block">Licença Vitalícia com Suporte Técnico:</span>
            <span className="text-xl font-extrabold text-blue-900">
              {formatMZN(system.price)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={system.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Abrir Demo em Nova Aba</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                onAddToCart(system);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Adquirir Este Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

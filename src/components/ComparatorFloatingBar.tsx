import React from 'react';
import { SystemProduct } from '../types';
import { formatMZN } from '../utils/pricing';
import { GitCompare, X, ArrowRight, Trash2 } from 'lucide-react';

interface ComparatorFloatingBarProps {
  selectedSystems: SystemProduct[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenModal: () => void;
}

export const ComparatorFloatingBar: React.FC<ComparatorFloatingBarProps> = ({
  selectedSystems,
  onRemove,
  onClear,
  onOpenModal,
}) => {
  if (selectedSystems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-700 animate-slide-up flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left: Info & Thumbnails */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Comparador</span>
              <span className="bg-blue-500/30 text-blue-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-blue-400/30">
                {selectedSystems.length}/3
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {selectedSystems.length === 1
                ? 'Selecione mais um para comparar'
                : 'Sistemas prontos para confronto'}
            </p>
          </div>
        </div>

        {/* Selected Systems Pills */}
        <div className="flex items-center gap-2">
          {selectedSystems.map((sys) => (
            <div
              key={sys.id}
              className="bg-slate-800/90 border border-slate-700 pl-1.5 pr-2 py-1 rounded-xl flex items-center gap-2 text-xs shrink-0 group"
            >
              <img
                src={sys.imageUrl}
                alt={sys.title}
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="font-semibold text-[11px] text-slate-200 max-w-[100px] truncate">
                {sys.title.split(' ')[0]}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(sys.id);
                }}
                className="text-slate-400 hover:text-red-400 p-0.5 rounded transition"
                aria-label={`Remover ${sys.title} da comparação`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {selectedSystems.length < 3 && (
            <div className="hidden md:flex items-center border border-dashed border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-slate-400 shrink-0">
              + Selecionar outro no catálogo
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <button
          onClick={onClear}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          title="Limpar seleção"
          aria-label="Limpar comparação"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenModal}
          disabled={selectedSystems.length < 2}
          className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <span>Comparar Agora ({selectedSystems.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

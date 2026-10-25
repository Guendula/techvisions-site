import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import {
  X,
  MapPin,
  Sparkles,
  ExternalLink,
  Loader2,
  Navigation,
  Compass,
  MessageSquare,
  Building,
} from 'lucide-react';

interface MapsAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapsAdvisorModal: React.FC<MapsAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('Maputo (Padrão)');

  if (!isOpen) return null;

  const quickPrompts = [
    'Onde encontrar impressoras térmicas, balanças e gavetas POS em Maputo?',
    'Qual o sistema ideal da TechVisions para uma padaria ou mercearia na Matola?',
    'Escritórios de suporte e assistência técnica da TechVisions em Moçambique',
    'Onde encontrar lojas de ferragens e materiais de construção na Baixa de Maputo?',
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setGeoStatus(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setGeoStatus('Maputo, Moçambique');
        }
      );
    }
  };

  const handleConsult = async (queryText?: string) => {
    const textToQuery = queryText || prompt;
    if (!textToQuery.trim()) return;

    setIsLoading(true);
    setAnswer(null);
    setGroundingChunks([]);

    try {
      const response = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToQuery,
          userLocation: userCoords,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer || 'Informação atualizada.');
      setGroundingChunks(data.groundingChunks || []);
    } catch (err: any) {
      setAnswer('Não foi possível obter resposta no momento. Por favor tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Fechar consultor"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Gemini 3.8 Flash + Google Maps Grounding
            </span>
          </div>
          <h2 className="text-2xl font-bold">Consultor TechVisions &amp; Localizador Moçambique</h2>
          <p className="text-emerald-100 text-xs mt-1">
            Recomendações inteligentes de sistemas comerciais conectadas a locais reais no Google Maps (escritórios, revendedores de hardware POS e lojas parceiras).
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Localização ativa: <strong>{geoStatus}</strong></span>
            <button
              onClick={handleGetLocation}
              className="ml-auto underline hover:text-white flex items-center gap-1 font-semibold"
            >
              <Navigation className="w-3 h-3" />
              <span>Usar meu GPS</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50">
          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Perguntas frequentes para Moçambique:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(q);
                    handleConsult(q);
                  }}
                  className="text-left text-xs bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Pergunte sobre software para o seu comércio ou locais em Moçambique..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConsult();
                }}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleConsult()}
                disabled={isLoading || !prompt.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Consultar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Response Text */}
          {answer && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Resposta do Consultor TechVisions:</span>
              </div>
              <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          )}

          {/* Google Maps Grounding Extracted Links (MANDATORY REQUIREMENT) */}
          {groundingChunks.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Locais Verificados no Google Maps:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {groundingChunks.map((chunk, idx) => {
                  const mapItem = chunk.maps;
                  if (!mapItem) return null;
                  return (
                    <a
                      key={idx}
                      href={mapItem.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 line-clamp-1">
                            {mapItem.title}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 shrink-0 ml-1" />
                        </div>
                        {mapItem.placeAnswerSources?.reviewSnippets?.[0]?.snippet && (
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                            "{mapItem.placeAnswerSources.reviewSnippets[0].snippet}"
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-blue-600 font-semibold mt-2 group-hover:underline">
                        Abrir rota no Google Maps →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-4 px-6 flex items-center justify-between text-xs text-gray-500">
          <span>TechVisions Moçambique • Maputo, Matola &amp; Beira</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

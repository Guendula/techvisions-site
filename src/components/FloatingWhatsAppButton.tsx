import React, { useState, useEffect } from 'react';
import { CompanySettings } from '../types';
import { buildWhatsAppChatUrl, WHATSAPP_QUICK_OPTIONS } from '../utils/whatsapp';
import { MessageCircle, X, Send, Sparkles, Phone, ShieldCheck, Check } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  companySettings?: CompanySettings;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ companySettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('geral');
  const [customMessage, setCustomMessage] = useState(
    'Olá TechVisions, gostaria de obter mais informações sobre as soluções e serviços para a minha empresa.'
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const phone = companySettings?.whatsapp || companySettings?.phone || '+258 84 312 9000';
  const companyName = companySettings?.name || 'TechVisions Moçambique';

  // Show tooltip after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    const option = WHATSAPP_QUICK_OPTIONS.find((o) => o.id === id);
    if (option) {
      setCustomMessage(option.promptText);
    }
  };

  const handleStartChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const url = buildWhatsAppChatUrl(phone, customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end">
      {/* Tooltip speech bubble when closed */}
      {!isOpen && showTooltip && (
        <div className="mb-2 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce-subtle max-w-[240px]">
          <span className="text-[13px]">👋</span>
          <div>
            <p className="font-bold text-[11px] leading-tight text-white">Precisa de Ajuda ou Cotação?</p>
            <p className="text-[10px] text-slate-300">Fale connosco no WhatsApp agora!</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Expandable Quick WhatsApp Chat Card */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-88 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 text-xs">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-black text-sm text-white leading-tight">{companyName}</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></span>
                  <span>Online agora • Atendimento Comercial</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              title="Fechar janela de chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3 bg-slate-50/70">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
              <p className="text-gray-700 text-[11px] leading-relaxed">
                Olá! 👋 Seja bem-vindo à <strong>{companyName}</strong>. Como podemos ajudar o seu negócio hoje?
              </p>
              <span className="text-[9px] text-gray-400 block text-right">Agora mesmo</span>
            </div>

            {/* Quick Topic Pills */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                Escolha o assunto ou escreva abaixo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {WHATSAPP_QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTopic(opt.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                      selectedTopicId === opt.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">
                Sua Mensagem:
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Start Chat Button */}
            <button
              onClick={() => handleStartChat()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Iniciar Conversa no WhatsApp</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Número oficial: {phone} • Moçambique</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          setShowTooltip(false);
          setIsOpen(!isOpen);
        }}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border-2 border-white/40"
        aria-label="Fale Connosco no WhatsApp"
      >
        {/* Pulsing beacon */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>

        {/* WhatsApp Icon */}
        <div className="w-6 h-6 flex items-center justify-center">
          <svg
            className="w-6 h-6 fill-current text-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        {/* Text */}
        <span className="font-extrabold text-sm tracking-tight hidden sm:inline-block">
          Fale Connosco
        </span>
      </button>
    </div>
  );
};

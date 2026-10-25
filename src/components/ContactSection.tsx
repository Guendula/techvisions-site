import React, { useState } from 'react';
import { CompanySettings } from '../types';
import { buildWhatsAppChatUrl } from '../utils/whatsapp';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface ContactSectionProps {
  companySettings?: CompanySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ companySettings }) => {
  const companyName = companySettings?.name || 'TechVisions';
  const phone = companySettings?.phone || '(+258) 84 312 9000';
  const whatsapp = companySettings?.whatsapp || '(+258) 84 312 9000';
  const email = companySettings?.email || 'comercial@techvisions.co.mz';
  const address =
    companySettings?.address ||
    'Av. 24 de Julho, Edifício Maputo Business Tower, 7º Andar, Maputo';
  const nuit = companySettings?.nuit || '400192831';

  // Contact form state
  const [name, setName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subject, setSubject] = useState('Geral / Informações');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactPhone.trim()) {
      setErrorMsg('Por favor indique o seu nome e telemóvel para contacto.');
      return;
    }

    setErrorMsg('');
    const fullMessage = `*NOVO CONTACTO DO SITE - TECHVISIONS*\n\n*Nome:* ${name.trim()}\n*Telefone:* ${contactPhone.trim()}\n*Email:* ${contactEmail.trim() || 'Não indicado'}\n*Assunto:* ${subject}\n\n*Mensagem:* ${message.trim() || 'Gostaria de obter informações comerciais.'}`;
    const url = buildWhatsAppChatUrl(whatsapp, fullMessage);
    window.open(url, '_blank', 'noopener,noreferrer');

    setIsSent(true);
  };

  return (
    <section
      id="contacto-section"
      className="bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/90 text-slate-900 py-14 sm:py-18 px-4 sm:px-6 border-t-2 border-emerald-500/30 relative"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300 shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fale Connosco • Atendimento Direto</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Fale Connosco em Moçambique
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Estamos prontos para atender a sua empresa com cotações imediatas, esclarecimento de dúvidas e agendamento de suporte técnico presencial em Maputo e Matola.
          </p>
        </div>

        {/* Contact Cards & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Details Cards */}
          <div className="space-y-3.5">
            {/* WhatsApp Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 shadow-sm space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    WhatsApp Comercial &amp; Suporte
                  </span>
                  <h4 className="font-black text-slate-900 text-sm truncate">{whatsapp}</h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Resposta rápida em poucos minutos para cotações e suporte técnico.
              </p>
              <a
                href={buildWhatsAppChatUrl(whatsapp, 'Olá TechVisions, gostaria de falar com a vossa equipa.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-80" />
              </a>
            </div>

            {/* Phone Card */}
            <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                    Linha Telefónica Direta
                  </span>
                  <h4 className="font-black text-slate-900 text-sm truncate">{phone}</h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Atendimento de voz de segunda a sábado em horário comercial.
              </p>
            </div>

            {/* Email Card */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Correio Eletrónico
                  </span>
                  <h4 className="font-black text-slate-900 text-sm truncate">{email}</h4>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Envie termos de referência, pedidos formais e concursos.
              </p>
            </div>

            {/* Office & NUIT */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Instalações &amp; Localização</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">{address}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">NUIT Fiscal:</span>
                <span className="font-mono font-bold text-slate-900">{nuit}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Horário:</span>
                <span className="font-medium text-slate-800">Seg - Sáb: 07:30 - 18:30</span>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-7 border border-emerald-200/80 shadow-md space-y-4 text-xs">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Envie-nos uma Mensagem ou Pedido de Cotação
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Preencha os campos abaixo para contacto rápido da nossa equipa.
                </p>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online agora
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSent ? (
              <div className="py-8 text-center space-y-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 text-base">Mensagem Aberta com Sucesso!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  A sua mensagem foi direcionada para o WhatsApp comercial da <strong>{companyName}</strong>. A nossa equipa responderá em poucos instantes.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Seu Nome / Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Armando Cossa (Supermercado Estrela)"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Telemóvel / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+258 84 / 85 / 86 / 87..."
                      value={contactPhone}
                      onChange={(e) => {
                        setContactPhone(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email de Contacto</label>
                    <input
                      type="email"
                      placeholder="seu.email@empresa.co.mz"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assunto de Interesse</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Geral / Informações">Geral / Informações</option>
                      <option value="Venda de Material de Escritório">Venda de Material de Escritório</option>
                      <option value="Servidores de Arquivos (Offline / Cloud)">Servidores de Arquivos (Offline / Cloud)</option>
                      <option value="Email Corporativo Profissional">Email Corporativo Profissional</option>
                      <option value="Criação de Programas Web e Mobile">Criação de Programas Web e Mobile</option>
                      <option value="Gestão de Stock & Organização Empresarial">Gestão de Stock &amp; Organização Empresarial</option>
                      <option value="Softwares POS e Demonstração">Softwares POS e Demonstração</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Como podemos ajudar a sua empresa? (Detalhes)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva a sua necessidade, quantidade de computadores, armazém, tipo de negócio ou dúvidas..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-500">
                    Atendimento imediato via WhatsApp: <strong className="text-slate-700">{whatsapp}</strong>
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

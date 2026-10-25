import React from 'react';
import { CompanySettings } from '../types';
import {
  ShieldCheck,
  Target,
  Eye,
  Award,
  Users,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

interface AboutUsSectionProps {
  companySettings?: CompanySettings;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ companySettings }) => {
  const companyName = companySettings?.name || 'TechVisions';

  const stats = [
    { label: 'Empresas & Lojas Atendidas', value: '+1.200', note: 'Em Maputo, Matola e províncias' },
    { label: 'Uptime & Resiliência Offline', value: '99.8%', note: 'Faturação contínua sem internet' },
    { label: 'Integração Carteiras Móveis', value: '100%', note: 'M-Pesa e E-Mola automatizados' },
    { label: 'Anos de Experiência Local', value: '+8 Anos', note: 'Especialistas no mercado moçambicano' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Nossa Missão',
      desc: 'Capacitar comerciantes e empresas moçambicanas com tecnologia acessível, softwares práticos e infraestrutura resiliente que resistem a falhas de energia e rede.',
    },
    {
      icon: Eye,
      title: 'Nossa Visão',
      desc: 'Ser o principal ecossistema de soluções tecnológicas de Moçambique, reconhecido pela excelência em software POS, material de escritório e servidores corporativos.',
    },
    {
      icon: HeartHandshake,
      title: 'Nossos Valores',
      desc: 'Transparência, suporte presencial humanizado, conformidade fiscal rigorosa (NUIT e IVA) e compromisso genuíno com a rentabilidade dos nossos clientes.',
    },
  ];

  return (
    <section id="sobre-nos-section" className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Sobre a Nossa Empresa</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Tecnologia e Gestão Feita Sob Medida para Moçambique
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            A <strong>{companyName}</strong> é uma empresa moçambicana especializada no desenvolvimento de sistemas de ponto de venda (POS), fornecimento de material de escritório, configuração de servidores locais/cloud, emails corporativos e consultoria prática para organização de armazéns e stock.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors"
            >
              <span className="text-2xl sm:text-4xl font-black text-blue-900 block tracking-tight">
                {s.value}
              </span>
              <span className="font-bold text-gray-900 text-xs sm:text-sm mt-1 block">
                {s.label}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">{s.note}</span>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((v, i) => {
            const IconComp = v.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-black text-gray-900 text-base">{v.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Local Support & Engineering Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Sede em Maputo • Atendimento Presencial em Todo Moçambique</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              A Nossa Equipa Desloca-se às Suas Instalações
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Diferente de softwares estrangeiros que não entendem a realidade de Moçambique, a nossa equipa de técnicos e consultores instala impressoras de talões, configura redes e servidores locais e treina presencialmente os seus operadores de caixa e fiéis de armazém.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <a
              href="#contacto-section"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition text-center shadow-lg shadow-blue-900/40"
            >
              Falar com a Nossa Equipa
            </a>
            <a
              href="#servicos-section"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition text-center border border-white/20"
            >
              Conhecer Nossos Serviços
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

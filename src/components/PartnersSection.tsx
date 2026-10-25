import React from 'react';
import { PartnerIntegration } from '../types';
import {
  Smartphone,
  Building2,
  CreditCard,
  Cpu,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PartnersSectionProps {
  partners?: PartnerIntegration[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners = [] }) => {
  // Curated list or fallback if partners prop is provided
  const displayPartners: PartnerIntegration[] = partners.length > 0 ? partners : [
    {
      id: 'partner-mpesa',
      name: 'Vodacom M-Pesa',
      category: 'telco',
      categoryLabel: 'Carteira Móvel',
      logo: '',
      status: 'Oficial',
      features: ['STK Push'],
      description: 'API STK Push em tempo real (84 & 85)',
    },
    {
      id: 'partner-emola',
      name: 'Movitel E-Mola',
      category: 'telco',
      categoryLabel: 'Carteira Móvel',
      logo: '',
      status: 'Oficial',
      features: ['USSD Gateway'],
      description: 'Cobrança móvel instantânea (86 & 87)',
    },
    {
      id: 'partner-bim',
      name: 'Millennium BIM',
      category: 'banking',
      categoryLabel: 'Rede Bancária',
      logo: '',
      status: 'Homologado',
      features: ['SIMO Rede'],
      description: 'Rede SIMO e cartões Visa / Débito',
    },
    {
      id: 'partner-bci',
      name: 'BCI Moçambique',
      category: 'banking',
      categoryLabel: 'Rede Bancária',
      logo: '',
      status: 'Homologado',
      features: ['ISO 20022'],
      description: 'Liquidação e referências bancárias',
    },
    {
      id: 'partner-sunmi',
      name: 'Sunmi POS',
      category: 'hardware',
      categoryLabel: 'Hardware Certificado',
      logo: '',
      status: 'Certificado',
      features: ['Android POS'],
      description: 'Terminais móveis Android para balcão',
    },
    {
      id: 'partner-epson',
      name: 'Epson Térmicas',
      category: 'hardware',
      categoryLabel: 'Hardware Certificado',
      logo: '',
      status: 'Certificado',
      features: ['ESC/POS'],
      description: 'Impressão de faturas e talões ESC/POS',
    },
  ];

  const getPartnerBadge = (partner: PartnerIntegration) => {
    switch (partner.id) {
      case 'partner-mpesa':
        return {
          icon: <Smartphone className="w-4 h-4 text-red-500" />,
          accent: 'border-red-500/30 hover:border-red-500/60 bg-red-950/20',
          dot: 'bg-red-500',
          tag: 'STK Push M-Pesa',
        };
      case 'partner-emola':
        return {
          icon: <Zap className="w-4 h-4 text-amber-500" />,
          accent: 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20',
          dot: 'bg-amber-500',
          tag: 'USSD E-Mola',
        };
      case 'partner-bim':
        return {
          icon: <Building2 className="w-4 h-4 text-rose-400" />,
          accent: 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/20',
          dot: 'bg-rose-500',
          tag: 'SIMO Rede / BIM',
        };
      case 'partner-bci':
        return {
          icon: <CreditCard className="w-4 h-4 text-blue-400" />,
          accent: 'border-blue-500/30 hover:border-blue-500/60 bg-blue-950/20',
          dot: 'bg-blue-500',
          tag: 'Banco BCI',
        };
      case 'partner-sunmi':
        return {
          icon: <Cpu className="w-4 h-4 text-orange-400" />,
          accent: 'border-orange-500/30 hover:border-orange-500/60 bg-orange-950/20',
          dot: 'bg-orange-500',
          tag: 'Hardware POS',
        };
      case 'partner-epson':
        return {
          icon: <Printer className="w-4 h-4 text-cyan-400" />,
          accent: 'border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/20',
          dot: 'bg-cyan-500',
          tag: 'Impressão 80mm',
        };
      default:
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          accent: 'border-slate-700/60 hover:border-slate-600 bg-slate-900/60',
          dot: 'bg-emerald-400',
          tag: partner.status || 'Homologado',
        };
    }
  };

  return (
    <section
      id="parceiros-section"
      className="bg-slate-950 text-slate-200 py-6 sm:py-8 px-4 sm:px-6 border-t border-b border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              Parceiros &amp; Integrações Homologadas
            </span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>APIs e Equipamentos compatíveis com a legislação fiscal de Moçambique</span>
          </span>
        </div>

        {/* Compact Grid of Partners - minimal height and clean badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {displayPartners.slice(0, 6).map((partner) => {
            const badge = getPartnerBadge(partner);
            return (
              <div
                key={partner.id}
                className={`p-2.5 rounded-xl border ${badge.accent} transition duration-150 flex items-center gap-2.5 shadow-xs`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {partner.name.replace(' Moçambique', '').replace(' (Banco Comercial e de Investimentos)', '')}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate leading-tight">
                    {badge.tag}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

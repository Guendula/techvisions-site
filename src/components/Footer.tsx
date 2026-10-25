import React from 'react';
import { Code2, Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import { CompanySettings } from '../types';

interface FooterProps {
  companySettings?: CompanySettings;
}

export const Footer: React.FC<FooterProps> = ({ companySettings }) => {
  const companyName = companySettings?.name || 'TechVisions';
  const address =
    companySettings?.address ||
    'Av. 24 de Julho, Edifício Maputo Business Tower • Maputo, Moçambique';
  const email = companySettings?.email || 'comercial@techvisions.co.mz';
  const phone = companySettings?.phone || '(+258) 84 312 9000';

  return (
    <footer className="bg-gradient-to-b from-[#0f2347] via-[#0b1936] to-[#060e20] text-blue-100/80 text-xs relative">
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              {companySettings?.logoUrl ? (
                <img
                  src={companySettings.logoUrl}
                  alt={companyName}
                  className="w-9 h-9 rounded-xl object-cover border border-blue-400/30 shadow-md"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950/50">
                  <Code2 className="w-5 h-5" />
                </div>
              )}
              <span className="text-lg font-black tracking-tight text-white">{companyName}</span>
            </div>
            <p className="text-blue-200/75 leading-relaxed text-[11px]">
              Empresa líder no desenvolvimento de sistemas web, aplicações móveis, servidores empresariais e soluções de ponto de venda (POS) em Moçambique.
            </p>
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{address}</span>
            </div>
          </div>

          {/* Col 2: Serviços & Soluções */}
          <div className="space-y-2.5">
            <h4 className="text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              Serviços &amp; Soluções TI
            </h4>
            <ul className="space-y-1.5 text-[11px] text-blue-100/80">
              <li>
                <a href="#servicos-section" className="hover:text-emerald-300 transition">
                  Material de Escritório &amp; Consumíveis
                </a>
              </li>
              <li>
                <a href="#servicos-section" className="hover:text-emerald-300 transition">
                  Servidores de Arquivos (Offline &amp; Cloud)
                </a>
              </li>
              <li>
                <a href="#servicos-section" className="hover:text-emerald-300 transition">
                  Email Corporativo (@empresa.co.mz)
                </a>
              </li>
              <li>
                <a href="#servicos-section" className="hover:text-emerald-300 transition">
                  Desenvolvimento Web &amp; Apps Mobile
                </a>
              </li>
              <li>
                <a href="#servicos-section" className="hover:text-emerald-300 transition">
                  Gestão de Stock &amp; Organização de Armazém
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-cyan-300 transition text-cyan-400 font-semibold">
                  Sistemas POS para Comércio Geral →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Pagamentos Moçambique */}
          <div className="space-y-2.5">
            <h4 className="text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              Pagamentos Aceites
            </h4>
            <p className="text-[11px] text-blue-200/75">
              Processamento instantâneo através das carteiras móveis e redes bancárias de Moçambique:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-400/40 text-red-200 font-bold text-[10px]">
                M-Pesa (Vodacom)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-[10px]">
                E-Mola (Movitel)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold text-[10px]">
                Cartão Visa / SIMO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] pt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Transações protegidas com criptografia ponta a ponta</span>
            </div>
          </div>

          {/* Col 4: Suporte Técnico */}
          <div className="space-y-2.5">
            <h4 className="text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              Linha de Atendimento
            </h4>
            <div className="space-y-1.5 text-[11px] text-blue-100/90">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{email}</span>
              </p>
              <p className="text-blue-200/70 text-[10px] pt-1 leading-relaxed">
                Segunda a Sábado: 07:30 - 18:30
                <br />
                Atendimento presencial em Maputo e Matola
              </p>
              <a
                href="#contacto-section"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition pt-1"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Formulário Fale Connosco Acima</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-blue-200/70">
          <p>© {new Date().getFullYear()} {companyName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5 text-cyan-300/90 font-medium">
            <span>Desenvolvido com excelência para empresas de Moçambique</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

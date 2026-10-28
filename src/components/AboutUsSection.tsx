import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CompanySettings } from '../types';
import {
  Target,
  Eye,
  Sparkles,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

interface AboutUsSectionProps {
  companySettings?: CompanySettings;
}

interface StatItemConfig {
  label: string;
  target: number;
  prefix: string;
  suffix: string;
  decimals: number;
  useDotSeparator: boolean;
  finalDisplay: string;
  note: string;
}

const STATS_CONFIG: StatItemConfig[] = [
  {
    label: 'Empresas & Lojas Atendidas',
    target: 1200,
    prefix: '+',
    suffix: '',
    decimals: 0,
    useDotSeparator: true,
    finalDisplay: '+1.200',
    note: 'Em Maputo, Matola e províncias',
  },
  {
    label: 'Uptime & Resiliência Offline',
    target: 99.8,
    prefix: '',
    suffix: '%',
    decimals: 1,
    useDotSeparator: false,
    finalDisplay: '99.8%',
    note: 'Faturação contínua sem internet',
  },
  {
    label: 'Integração Carteiras Móveis',
    target: 100,
    prefix: '',
    suffix: '%',
    decimals: 0,
    useDotSeparator: false,
    finalDisplay: '100%',
    note: 'M-Pesa e E-Mola automatizados',
  },
  {
    label: 'Anos de Experiência Local',
    target: 8,
    prefix: '+',
    suffix: ' Anos',
    decimals: 0,
    useDotSeparator: false,
    finalDisplay: '+8 Anos',
    note: 'Especialistas no mercado moçambicano',
  },
];

export function formatStatCounterValue(currentValue: number, stat: StatItemConfig): string {
  if (stat.decimals > 0) {
    return `${stat.prefix}${currentValue.toFixed(stat.decimals)}${stat.suffix}`;
  }
  const rounded = Math.round(currentValue);
  const formattedNumber = stat.useDotSeparator
    ? rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : rounded.toString();
  return `${stat.prefix}${formattedNumber}${stat.suffix}`;
}

const AnimatedStatCard: React.FC<{
  stat: StatItemConfig;
  triggerKey: number;
}> = ({ stat, triggerKey }) => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const runCountUp = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setCurrentValue(0);
    setIsAnimating(true);

    const duration = 1600;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration at the target number
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextVal = stat.target * eased;

      if (progress < 1) {
        setCurrentValue(nextVal);
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCurrentValue(stat.target);
        setIsAnimating(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [stat.target]);

  useEffect(() => {
    if (triggerKey > 0) {
      runCountUp();
    } else {
      setCurrentValue(0);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [triggerKey, runCountUp]);

  return (
    <div
      onMouseEnter={runCountUp}
      data-testid={`stat-card-${stat.label}`}
      className="group p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer select-none"
    >
      <span
        data-testid="stat-animated-value"
        className={`text-2xl sm:text-4xl font-black block tracking-tight tabular-nums transition-transform duration-200 ${
          isAnimating ? 'text-blue-600 scale-[1.03]' : 'text-blue-900 group-hover:text-blue-700'
        }`}
      >
        {formatStatCounterValue(currentValue, stat)}
      </span>
      <span className="font-bold text-gray-900 text-xs sm:text-sm mt-1 block">
        {stat.label}
      </span>
      <span className="text-[11px] text-gray-500 mt-0.5 block">{stat.note}</span>
    </div>
  );
};

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ companySettings }) => {
  const companyName = companySettings?.name || 'TechVisions';
  const statsContainerRef = useRef<HTMLDivElement | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState<number>(0);

  useEffect(() => {
    const el = statsContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimationTrigger((prev) => prev + 1);
          } else {
            // Reset to 0 when out of view so approaching again starts from 0
            setAnimationTrigger(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

        {/* Animated Stats Grid (Counts from 0 to target on scroll into view or hover) */}
        <div
          ref={statsContainerRef}
          data-testid="about-stats-grid"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS_CONFIG.map((s, i) => (
            <AnimatedStatCard key={i} stat={s} triggerKey={animationTrigger} />
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

import React, { useState, useEffect, useRef } from 'react';
import { ProductCategory, HeroSlide, CategoryItem } from '../types';
import {
  Search,
  CheckCircle,
  Smartphone,
  WifiOff,
  ShieldCheck,
  Zap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Printer,
  CreditCard,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';

interface HeroProps {
  slides?: HeroSlide[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory | 'Todas';
  onCategoryChange: (cat: ProductCategory | 'Todas') => void;
  onOpenMapsAdvisor: () => void;
  onCtaClick?: (link: string) => void;
  categories?: CategoryItem[];
}

const CATEGORIES: (ProductCategory | 'Todas')[] = [
  'Todas',
  'Padaria',
  'Mercearia',
  'Restaurante & Bar',
  'Ferragens',
  'Supermercado',
  'Loja de Roupas',
  'Gestão de Stock & Armazém',
  'Venda de Serviços',
  'Comércio Eletrónico',
  'Sistemas Financeiros',
];

export const Hero: React.FC<HeroProps> = ({
  slides = [],
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenMapsAdvisor,
  onCtaClick,
  categories = [],
}) => {
  const availableCategories: (ProductCategory | 'Todas')[] = categories.length > 0
    ? ['Todas', ...categories.map((c) => c.name)]
    : CATEGORIES;

  // Use active slides, fallback to default if empty
  const activeSlides = slides.filter((s) => s.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = activeSlides.length;
  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  // Auto-play timer
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
      setAnimKey((prev) => prev + 1);
    }, 7000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalSlides, isPaused, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setAnimKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setAnimKey((prev) => prev + 1);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentIndex(idx);
    setAnimKey((prev) => prev + 1);
  };

  const handleAction = (link: string) => {
    if (link === '#maps-advisor' || link === 'maps-advisor') {
      onOpenMapsAdvisor();
      return;
    }
    if (onCtaClick) {
      onCtaClick(link);
    }
    if (link.startsWith('#')) {
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const renderPillIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'wifioff':
      case 'wifi-off':
        return <WifiOff className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'shieldcheck':
      case 'shield-check':
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      case 'printer':
        return <Printer className="w-3.5 h-3.5 text-indigo-300 shrink-0" />;
      case 'creditcard':
      case 'credit-card':
        return <CreditCard className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'filespreadsheet':
      case 'file-spreadsheet':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300 shrink-0" />;
      case 'mappin':
      case 'map-pin':
        return <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  if (!currentSlide) {
    return null;
  }

  // Split title and highlight word into characters for kinetic stagger
  const titleChars = currentSlide.title.split('');
  const highlightChars = currentSlide.highlightWord.split('');

  return (
    <div
      className="relative overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background with subtle Ken Burns overlay image & radial ambient gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {currentSlide.imageUrl && (
          <div
            key={`bg-${currentSlide.id}-${animKey}`}
            className="absolute inset-0 opacity-15 mix-blend-luminosity bg-cover bg-center animate-ken-burns transition-opacity duration-1000"
            style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
          />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentSlide.gradientFrom || 'from-slate-950'} ${
            currentSlide.gradientVia || 'via-blue-950'
          } ${currentSlide.gradientTo || 'to-slate-900'} opacity-90 transition-all duration-1000`}
        />
        {/* Glow ambient spots */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Slider Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 relative z-10">
        {/* Slide Carousel Top Navigation Controls */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-between mb-4 text-xs">
            {/* Slide Index Badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 font-mono font-bold tracking-wider text-[11px]">
                SLIDE {currentIndex + 1} / {totalSlides}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
                title={isPaused ? 'Continuar rotação automática' : 'Pausar rotação'}
                aria-label={isPaused ? 'Continuar' : 'Pausar'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white transition flex items-center justify-center backdrop-blur-md shadow-xs"
                title="Slide Anterior"
                aria-label="Slide Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white transition flex items-center justify-center backdrop-blur-md shadow-xs"
                title="Slide Seguinte"
                aria-label="Slide Seguinte"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Animated Slide Body */}
        <div key={`slide-content-${currentSlide.id}-${animKey}`} className="text-center">
          {/* Moz Badge with Animated Pulse */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate max-w-sm sm:max-w-none">{currentSlide.badge}</span>
          </div>

          {/* Kinetic Typography: Animated Headline with Letter-by-Letter Stagger */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            {/* Title letters */}
            <span className="inline">
              {titleChars.map((char, i) => (
                <span
                  key={`t-${i}`}
                  className="animate-kinetic-letter"
                  style={{
                    animationDelay: `${Math.min(i * 22, 600)}ms`,
                    display: char === ' ' ? 'inline' : 'inline-block',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char}
                </span>
              ))}
            </span>{' '}
            <br className="hidden sm:inline" />
            {/* Kinetic Highlight Word with radiant shimmering gradient and glow */}
            <span className="inline-block mt-1">
              {currentSlide.highlightWord.split(' ').map((word, wIdx) => (
                <span
                  key={`hw-${wIdx}`}
                  className={`inline-block mx-1.5 bg-gradient-to-r ${
                    currentSlide.accentColor || 'from-blue-400 via-sky-300 to-emerald-400'
                  } bg-clip-text text-transparent animate-shimmer-text animate-kinetic-letter drop-shadow-[0_4px_16px_rgba(59,130,246,0.4)]`}
                  style={{
                    animationDelay: `${Math.min(200 + wIdx * 90, 600)}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle with soft smooth entrance */}
          <p
            className="mt-5 text-sm sm:text-base text-blue-100/90 max-w-3xl mx-auto leading-relaxed transition-all duration-700"
            style={{
              animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              animationDelay: '350ms',
            }}
          >
            {currentSlide.subtitle}
          </p>

          {/* Call-to-Action Buttons */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
            style={{
              animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              animationDelay: '480ms',
            }}
          >
            <button
              onClick={() => handleAction(currentSlide.primaryCtaLink)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{currentSlide.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleAction(currentSlide.secondaryCtaLink)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all backdrop-blur-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{currentSlide.secondaryCtaText}</span>
            </button>
          </div>

          {/* Stats & Value Proposition Pills Strip */}
          {currentSlide.statsPills && currentSlide.statsPills.length > 0 && (
            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-blue-100"
              style={{
                animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                animationDelay: '600ms',
              }}
            >
              {currentSlide.statsPills.map((pill, idx) => (
                <div
                  key={pill.id || idx}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xs animate-float-pill"
                  style={{ animationDelay: `${idx * 400}ms` }}
                >
                  {renderPillIcon(pill.icon)}
                  <span>{pill.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Pagination Indicator Dots with Progress */}
        {totalSlides > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                    isActive ? 'w-10 bg-white' : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`Ir para slide ${idx + 1}: ${slide.title}`}
                  aria-label={`Slide ${idx + 1}`}
                >
                  {isActive && !isPaused && (
                    <span
                      className="absolute inset-0 bg-blue-500 origin-left"
                      style={{
                        animation: 'shimmerGradient 7s linear infinite',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Global Catalog Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por sistema (ex: Padaria, Mercearia, Stock, Ferragens, Restaurante)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 text-sm placeholder:text-gray-400 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/40 border-0"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills Strip */}
        <div className="mt-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

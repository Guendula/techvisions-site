import React, { useState, useEffect, useRef } from 'react';
import { ProductCategory, HeroSlide, CategoryItem, SlideTextAnimation } from '../types';
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

const FALLBACK_SLIDE_IMAGES = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=85',
];

export function getSlideLetterAnimClass(anim?: SlideTextAnimation): string {
  switch (anim) {
    case 'typewriter':
      return 'animate-letter-typewriter';
    case 'wave':
      return 'animate-letter-wave';
    case 'zoom-pop':
      return 'animate-letter-zoom-pop';
    case 'slide-left':
      return 'animate-letter-slide-left';
    case 'glow-pulse':
      return 'animate-letter-glow-pulse';
    case 'kinetic':
    default:
      return 'animate-letter-kinetic';
  }
}

export function renderAnimatedWords(
  text: string,
  letterAnimClass: string,
  color?: string,
  baseDelayMs = 0,
  stepMs = 22,
  maxDelayMs = 700,
  extraLetterClass = ''
) {
  const words = (text || '').split(' ');
  let charCounter = 0;

  return words.map((word, wIdx) => {
    const wordChars = word.split('');
    return (
      <React.Fragment key={`word-${wIdx}`}>
        <span className="inline-block whitespace-nowrap" aria-hidden="true">
          {wordChars.map((ch, cIdx) => {
            const delay = Math.min(baseDelayMs + charCounter * stepMs, maxDelayMs);
            charCounter += 1;
            return (
              <span
                key={`ch-${wIdx}-${cIdx}`}
                className={`${letterAnimClass} inline-block ${extraLetterClass}`}
                style={{
                  color: color || undefined,
                  animationDelay: `${delay}ms`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
        {wIdx < words.length - 1 ? ' ' : null}
      </React.Fragment>
    );
  });
}

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
  const availableCategories: (ProductCategory | 'Todas')[] =
    categories.length > 0 ? ['Todas', ...categories.map((c) => c.name)] : CATEGORIES;

  // Use active slides, sorted by order
  const activeSlides = slides
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = activeSlides.length;
  const safeIndex = totalSlides > 0 ? currentIndex % totalSlides : 0;
  const currentSlide = activeSlides[safeIndex] || activeSlides[0];

  const getSlideImage = (slide: HeroSlide, idx: number) => {
    if (slide.imageUrl && slide.imageUrl.trim().length > 0) {
      return slide.imageUrl;
    }
    return FALLBACK_SLIDE_IMAGES[idx % FALLBACK_SLIDE_IMAGES.length];
  };

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
  }, [totalSlides, isPaused, safeIndex]);

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

  const letterAnimClass = getSlideLetterAnimClass(currentSlide.textAnimation);
  const titleColor = currentSlide.titleColor || '#FFFFFF';
  const highlightColor = currentSlide.highlightColor || '';
  const subtitleColor = currentSlide.subtitleColor || '#F1F5F9';
  const badgeColor = currentSlide.badgeColor || '#6EE7B7';

  return (
    <div
      data-testid="hero-fullbleed-slider"
      className="relative overflow-hidden bg-slate-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* FULL-BLEED SLIDE IMAGE COVERING 100% OF THE SLIDER AREA */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {activeSlides.map((slide, idx) => {
          const isCurrent = idx === safeIndex;
          const imgUrl = getSlideImage(slide, idx);
          return (
            <img
              key={`fullbleed-slide-img-${slide.id}`}
              data-testid={isCurrent ? 'hero-active-slide-img' : `hero-inactive-slide-img-${idx}`}
              src={imgUrl}
              alt={`${slide.title} ${slide.highlightWord}`}
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = FALLBACK_SLIDE_IMAGES[idx % FALLBACK_SLIDE_IMAGES.length];
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
                isCurrent ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-100 z-0'
              }`}
            />
          );
        })}

        {/* Subtle Dark Readability Scrim so the full image is clearly visible while custom-colored letters pop */}
        <div
          data-testid="hero-scrim-overlay"
          className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/65 via-slate-950/50 to-slate-950/75"
        />
      </div>

      {/* Main Slider Content Container Over Full-Bleed Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 relative z-30">
        {/* Slide Carousel Top Navigation Controls */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-between mb-6 text-xs">
            {/* Slide Index Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/25 text-white font-mono font-bold tracking-wider text-[11px] shadow-sm">
                SLIDE {safeIndex + 1} / {totalSlides}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-slate-950/50 hover:bg-slate-950/80 border border-white/20 text-white transition flex items-center gap-1 backdrop-blur-md"
                title={isPaused ? 'Continuar rotação automática' : 'Pausar rotação'}
                aria-label={isPaused ? 'Continuar' : 'Pausar'}
              >
                {isPaused ? (
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950/85 active:scale-95 border border-white/25 text-white transition flex items-center justify-center backdrop-blur-md shadow-md"
                title="Slide Anterior"
                aria-label="Slide Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950/85 active:scale-95 border border-white/25 text-white transition flex items-center justify-center backdrop-blur-md shadow-md"
                title="Slide Seguinte"
                aria-label="Slide Seguinte"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Centered Dynamic Animated Slide Text Over the Full-Width Image */}
        <div
          key={`slide-content-${currentSlide.id}-${animKey}`}
          data-testid="hero-slide-text-container"
          data-animation={currentSlide.textAnimation || 'kinetic'}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Moz Badge with Custom Color */}
          {currentSlide.badge && (
            <div
              data-testid="hero-slide-badge"
              style={{
                color: badgeColor,
                borderColor: `${badgeColor}55`,
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border text-xs font-bold mb-6 shadow-md backdrop-blur-md"
            >
              <span
                className="w-2 h-2 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: badgeColor }}
              />
              <span className="truncate max-w-xs sm:max-w-none">{currentSlide.badge}</span>
            </div>
          )}

          {/* Animated Headline with Per-Slide Animation & Custom Letter Colors */}
          <h1
            data-testid="hero-slide-headline"
            aria-label={`${currentSlide.title} ${currentSlide.highlightWord || ''}`.trim()}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
          >
            <span
              data-testid="hero-slide-title-letters"
              data-animation={currentSlide.textAnimation || 'kinetic'}
              className="inline"
              style={{ color: titleColor }}
            >
              {renderAnimatedWords(currentSlide.title || '', letterAnimClass, titleColor, 0, 22, 600)}
            </span>
            {currentSlide.highlightWord && (
              <>
                {' '}
                <br className="hidden sm:inline" />
                <span
                  data-testid="hero-slide-highlight-letters"
                  data-animation={currentSlide.textAnimation || 'kinetic'}
                  className="inline-block mt-1"
                  style={highlightColor ? { color: highlightColor } : undefined}
                >
                  {renderAnimatedWords(
                    currentSlide.highlightWord,
                    letterAnimClass,
                    highlightColor || undefined,
                    200,
                    24,
                    850,
                    !highlightColor
                      ? `bg-gradient-to-r ${
                          currentSlide.accentColor || 'from-blue-400 via-sky-300 to-emerald-400'
                        } bg-clip-text text-transparent animate-shimmer-text`
                      : ''
                  )}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle with Custom Color & Entrance */}
          {currentSlide.subtitle && (
            <p
              data-testid="hero-slide-subtitle"
              className="mt-5 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] transition-all duration-700"
              style={{
                color: subtitleColor,
                animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                animationDelay: '350ms',
              }}
            >
              {currentSlide.subtitle}
            </p>
          )}

          {/* Call-to-Action Buttons */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
            style={{
              animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              animationDelay: '480ms',
            }}
          >
            {currentSlide.primaryCtaText && (
              <button
                onClick={() => handleAction(currentSlide.primaryCtaLink)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-black/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{currentSlide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentSlide.secondaryCtaText && (
              <button
                onClick={() => handleAction(currentSlide.secondaryCtaLink)}
                className="px-5 py-3.5 rounded-2xl bg-slate-950/65 hover:bg-slate-950/85 border border-white/30 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all backdrop-blur-md flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{currentSlide.secondaryCtaText}</span>
              </button>
            )}
          </div>

          {/* Stats & Value Proposition Pills Strip */}
          {currentSlide.statsPills && currentSlide.statsPills.length > 0 && (
            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-3.5 text-xs font-semibold text-white"
              style={{
                animation: 'kineticLetter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                animationDelay: '600ms',
              }}
            >
              {currentSlide.statsPills.map((pill, idx) => (
                <div
                  key={pill.id || idx}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/65 border border-white/25 backdrop-blur-md shadow-md animate-float-pill"
                  style={{ animationDelay: `${idx * 400}ms` }}
                >
                  {renderPillIcon(pill.icon)}
                  <span>{pill.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Image Thumbnails & Pagination Dots */}
        {totalSlides > 1 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2.5">
              {activeSlides.map((slide, idx) => {
                const isActive = idx === safeIndex;
                const thumbUrl = getSlideImage(slide, idx);
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleSelectSlide(idx)}
                    data-testid={`hero-slide-thumb-${idx}`}
                    className={`group relative h-11 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isActive
                        ? 'w-20 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                        : 'w-14 border-white/35 opacity-70 hover:opacity-100'
                    }`}
                    title={`Ir para slide ${idx + 1}: ${slide.title} ${slide.highlightWord}`}
                    aria-label={`Slide ${idx + 1}`}
                  >
                    <img
                      src={thumbUrl}
                      alt={slide.highlightWord || slide.title}
                      className="w-full h-full object-cover"
                    />
                    {isActive && !isPaused && (
                      <span
                        className="absolute bottom-0 inset-x-0 h-1 bg-emerald-400 origin-left"
                        style={{
                          animation: 'shimmerGradient 7s linear infinite',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Catalog Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
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
        <div className="mt-5 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 backdrop-blur-md ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 border border-blue-400'
                  : 'bg-slate-950/60 text-white hover:bg-slate-950/80 border border-white/25'
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

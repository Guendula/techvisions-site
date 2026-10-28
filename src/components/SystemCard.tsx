import React, { useState } from 'react';
import { SystemProduct } from '../types';
import { formatMZN } from '../utils/pricing';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ThumbsUp,
  ShoppingCart,
  ExternalLink,
  Share2,
  Check,
  Smartphone,
  WifiOff,
  Cloud,
  GitCompare,
  PlayCircle,
} from 'lucide-react';

interface SystemCardProps {
  system: SystemProduct;
  onOpenDemo: (system: SystemProduct) => void;
  onSelectDetails?: (system: SystemProduct) => void;
  isCompared?: boolean;
  onToggleCompare?: (system: SystemProduct) => void;
}

export const SystemCard: React.FC<SystemCardProps> = ({
  system,
  onOpenDemo,
  onSelectDetails,
  isCompared = false,
  onToggleCompare,
}) => {
  const { user, likedSystemIds, favoriteSystemIds, toggleLike, toggleFavorite, requireAuth } = useAuth();
  const { addToCart } = useCart();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isLiked = likedSystemIds.includes(system.id);
  const isFavorite = favoriteSystemIds.includes(system.id);
  const totalLikes = system.likesCount + (isLiked ? 1 : 0);

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const shareText = `Conheça o ${system.title} da TechVisions - Soluções Web & Mobile para Moçambique! Preço: ${formatMZN(system.price)}`;

    if (platform === 'whatsapp') {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + url)}`,
        '_blank'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    setIsShareOpen(false);
  };

  const handleBuy = () => {
    requireAuth(() => {
      addToCart(system);
    }, `Inicie sessão para adicionar o ${system.title} ao seu carrinho e finalizar compra`);
  };

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
        isCompared
          ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
          : 'border-gray-100 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Top Banner / Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={system.imageUrl}
          alt={system.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category & Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {system.category}
          </span>
          {system.badges?.[0] && (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
              {system.badges[0]}
            </span>
          )}
        </div>

        {/* Top Right: Compare and Favorite Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => onToggleCompare?.(system)}
            className={`p-2 rounded-full backdrop-blur-md transition shadow-md flex items-center gap-1 text-[11px] font-bold ${
              isCompared
                ? 'bg-blue-600 text-white ring-2 ring-white/80'
                : 'bg-white/85 text-gray-700 hover:bg-white hover:text-blue-600'
            }`}
            title={isCompared ? 'Remover do comparador' : 'Adicionar ao comparador'}
            aria-label={isCompared ? 'Remover da comparação' : 'Comparar este sistema'}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline pr-1">{isCompared ? 'Comparando' : 'Comparar'}</span>
          </button>

          <button
            onClick={() => toggleFavorite(system.id)}
            className={`p-2.5 rounded-full backdrop-blur-md transition shadow-md ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/85 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            title={isFavorite ? 'Guardado nos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Feature Icons overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white/90 text-xs font-medium">
          {system.isMobileSupported && (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Mobile</span>
            </span>
          )}
          {system.specs?.offlineMode && (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
              <WifiOff className="w-3 h-3 text-blue-300" />
              <span>Offline</span>
            </span>
          )}
        </div>

        {/* Quick Demo Video Badge */}
        <button
          type="button"
          onClick={() => onOpenDemo(system)}
          className="absolute bottom-3 right-3 flex items-center gap-1 bg-rose-600/90 hover:bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm transition"
          title="Ver detalhes, vantagens e vídeos de demonstração"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Vídeos & Detalhes</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelectDetails?.(system)}
            className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition cursor-pointer line-clamp-1"
          >
            {system.title}
          </h3>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {system.description}
          </p>

          {/* Key bullets */}
          <ul className="mt-3 space-y-1">
            {system.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="text-[11px] text-gray-600 flex items-center gap-1.5 line-clamp-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Social Row */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block tracking-wider">
              Preço de Licença
            </span>
            <span className="text-xl font-black text-blue-950">
              {formatMZN(system.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Like button */}
            <button
              onClick={() => toggleLike(system.id)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition ${
                isLiked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              title="Gostar deste sistema"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-blue-600' : ''}`} />
              <span>{totalLikes}</span>
            </button>

            {/* Share dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="p-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition"
                title="Partilhar nas redes sociais"
                aria-label="Partilhar sistema"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {isShareOpen && (
                <div className="absolute right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-44 z-30 flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-2 p-2 hover:bg-green-50 text-green-700 rounded-xl font-medium transition text-left"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 p-2 hover:bg-blue-50 text-blue-700 rounded-xl font-medium transition text-left"
                  >
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 p-2 hover:bg-sky-50 text-sky-700 rounded-xl font-medium transition text-left"
                  >
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition text-left border-t border-gray-100"
                  >
                    {copiedLink ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Link Copiado!
                      </span>
                    ) : (
                      <span>Copiar Ligação</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="system-card-test-demo-btn"
            onClick={() => onOpenDemo(system)}
            title="Ver detalhes do programa, o que faz, vantagens, categorias e vídeos de demonstração"
            className="w-full py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <PlayCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Testar Demo</span>
          </button>

          <button
            onClick={handleBuy}
            className="w-full py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm hover:shadow-md active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

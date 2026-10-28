import React, { useState, useMemo } from 'react';
import { NewsArticle } from '../types';
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Share2,
  X,
  Check,
  Pause,
  Play,
  MoveRight,
} from 'lucide-react';

interface NewsSectionProps {
  articles: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const categories = ['Todas', 'Atualizações', 'Hardware', 'Fiscalidade', 'Dicas'];

  const filteredArticles = useMemo(() => {
    return articles.filter(
      (art) => selectedCategory === 'Todas' || art.category === selectedCategory
    );
  }, [articles, selectedCategory]);

  // Build a balanced list so each half of the infinite left-to-right marquee covers wide screens seamlessly
  const marqueeTrackItems = useMemo(() => {
    if (filteredArticles.length === 0) return [];
    let halfSet: NewsArticle[] = [...filteredArticles];
    while (halfSet.length < 6) {
      halfSet = [...halfSet, ...filteredArticles];
    }
    return [...halfSet, ...halfSet];
  }, [filteredArticles]);

  const handleShare = (art: NewsArticle) => {
    const shareText = `${art.title} - TechVisions Moçambique`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: shareText,
          text: art.summary,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      id="novidades-section"
      className="py-16 bg-white border-t border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-1 rounded-full text-xs font-bold">
            <Newspaper className="w-3.5 h-3.5 text-purple-600" />
            <span>TechVisions News &amp; Inovação</span>
            <span className="inline-flex items-center gap-1 pl-2 ml-1 border-l border-purple-200 text-purple-600 text-[10px]">
              <MoveRight className="w-3 h-3 animate-pulse" />
              <span>Desfile Contínuo</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight text-center">
            Novidades, Atualizações de Software &amp; Legislação Fiscal
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed text-center">
            Fique a par das novas versões dos nossos sistemas, lançamentos de equipamentos POS compatíveis e exigências fiscais em Moçambique. Passe o cursor sobre qualquer notícia para pausar.
          </p>

          {/* Filter Pills & Play/Pause Control Centered */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setIsPaused((prev) => !prev)}
              title={isPaused ? 'Retomar rotação das novidades' : 'Pausar rotação das novidades'}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isPaused
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continuar</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Left-to-Right Rolling News Carousel */}
      {marqueeTrackItems.length > 0 ? (
        <div className="relative w-full py-2">
          {/* Subtle Left & Right Edge Fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            data-testid="news-rolling-track"
            className={`animate-news-ltr ${isPaused ? 'is-paused' : ''}`}
          >
            {marqueeTrackItems.map((article, idx) => (
              <div
                key={`${article.id}-${idx}`}
                className="w-[290px] sm:w-[330px] shrink-0 px-3"
              >
                <article className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-200 flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-900/85 backdrop-blur-md text-white text-[11px] font-bold">
                          {article.category}
                        </span>
                        {article.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2 leading-snug mb-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setActiveArticle(article)}
                      className="w-full py-2 bg-slate-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border border-slate-200 hover:border-purple-600"
                    >
                      <span>Ler Artigo Completo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center py-10 text-gray-500 text-xs">
          Nenhuma novidade encontrada nesta categoria.
        </div>
      )}

      {/* Modal: Full Article Reading */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                {activeArticle.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activeArticle.date}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug mb-4">
              {activeArticle.title}
            </h2>

            <div className="rounded-2xl overflow-hidden mb-6 h-56 bg-slate-100">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-3 whitespace-pre-line text-xs sm:text-sm">
              {activeArticle.content}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-gray-400 block font-medium">Publicado por</span>
                <span className="text-xs font-bold text-gray-800">{activeArticle.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activeArticle)}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Partilhar Notícia</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

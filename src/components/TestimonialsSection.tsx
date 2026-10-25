import React, { useState } from 'react';
import { TestimonialComment, SystemProduct } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  MessageSquarePlus,
  Quote,
  CheckCircle,
  MapPin,
  Building,
  User,
  ThumbsUp,
  Send,
  X,
  Search,
  Filter,
  BadgeCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface TestimonialsSectionProps {
  comments: TestimonialComment[];
  systems: SystemProduct[];
  onAddComment: (comment: TestimonialComment) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  comments,
  systems,
  onAddComment,
}) => {
  const { user, requireAuth } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtering & Search
  const [selectedSector, setSelectedSector] = useState<string>('Todos');
  const [selectedCity, setSelectedCity] = useState<string>('Todas');
  const [searchFilter, setSearchFilter] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Form State for modal
  const [userName, setUserName] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [city, setCity] = useState('Maputo (Baixa)');
  const [businessSector, setBusinessSector] = useState('Mercearia & Supermercado');
  const [systemId, setSystemId] = useState(systems[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [impactMetric, setImpactMetric] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const sectors = [
    'Todos',
    'Panificação & Pastelaria',
    'Mercearia & Supermercado',
    'Ferragens & Materiais',
    'Restaurantes & Bares',
    'Moda & Retalho',
    'Farmácia & Saúde',
  ];

  const citiesMozambique = [
    'Todas',
    'Maputo (Cidade & Baixa)',
    'Matola (Malhampsene & Centro)',
    'Beira (Sofala)',
    'Nampula (Norte)',
    'Tete (Centro)',
    'Chimoio (Manica)',
    'Quelimane (Zambézia)',
    'Pemba (Cabo Delgado)',
    'Inhambane / Maxixe',
  ];

  const handleVoteHelpful = (commentId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1,
    }));
  };

  const handleOpenAddComment = () => {
    requireAuth(() => {
      if (user) {
        setUserName(user.name);
      }
      setIsModalOpen(true);
    }, 'Inicie sessão para partilhar o seu testemunho ou avaliação de um sistema TechVisions');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userCompany.trim()) return;

    const selectedSys = systems.find((s) => s.id === systemId);

    const newComment: TestimonialComment = {
      id: `comm-${Date.now()}`,
      userName: userName.trim() || user?.name || 'Comerciante TechVisions',
      userCompany: userCompany.trim(),
      city: city === 'Todas' ? 'Maputo' : city,
      businessSector,
      impactMetric: impactMetric.trim() || 'Modernização e Eficiência de Caixa',
      systemId,
      systemTitle: selectedSys ? selectedSys.title : 'Software TechVisions',
      rating,
      comment: commentText.trim(),
      date: new Date().toISOString().split('T')[0],
      isApproved: true,
      isFeatured: false,
      helpfulCount: 1,
      verifiedBadge: true,
    };

    onAddComment(newComment);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setIsModalOpen(false);
      setCommentText('');
      setUserCompany('');
      setImpactMetric('');
    }, 2000);
  };

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    const matchesSector =
      selectedSector === 'Todos' || c.businessSector === selectedSector;

    const matchesCity =
      selectedCity === 'Todas' ||
      c.city.toLowerCase().includes(selectedCity.toLowerCase().split(' ')[0]);

    const query = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.comment.toLowerCase().includes(query) ||
      c.userCompany.toLowerCase().includes(query) ||
      c.userName.toLowerCase().includes(query) ||
      (c.systemTitle && c.systemTitle.toLowerCase().includes(query));

    return matchesSector && matchesCity && matchesSearch;
  });

  // Featured Testimonial for Spotlight
  const spotlightComment = comments.find((c) => c.isFeatured) || comments[0];

  return (
    <section
      id="testemunhos-section"
      className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/90 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-900 border border-amber-300/60 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Experiência Real nos Balcões de Moçambique</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Aprovado por quem abre portas e fatura todos os dias em Moçambique
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
              De padarias industriais na Matola a minimercados de bairro e restaurantes na Costa do Sol, descubra como os empresários moçambicanos eliminaram perdas de stock e organizaram as contas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleOpenAddComment}
              className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Avaliar ou Deixar Testemunho</span>
            </button>
          </div>
        </div>

        {/* Aggregate Trust Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
                <span>4.98</span>
                <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Classificação Média Geral</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                +320
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Empresas e Balcões Ativos</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                99.4%
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Renovação Anual de Licenças</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                0 Minutos
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Perdidos em Cortes de EDM</p>
            </div>
          </div>
        </div>

        {/* Featured Story Spotlight (Destaque do Mês) */}
        {spotlightComment && (
          <div className="mb-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>História de Sucesso em Destaque</span>
                  </span>

                  {spotlightComment.impactMetric && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                      {spotlightComment.impactMetric}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Quote className="w-10 h-10 text-blue-400/20 absolute -top-4 -left-2 pointer-events-none" />
                  <p className="text-base sm:text-xl text-slate-100 font-medium leading-relaxed italic pl-6">
                    "{spotlightComment.comment}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-lg">
                    {spotlightComment.userName.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{spotlightComment.userName}</span>
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                    </h4>
                    <p className="text-xs text-slate-300">
                      {spotlightComment.userCompany} • <span className="text-slate-400">{spotlightComment.city}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 lg:w-72 shrink-0 backdrop-blur-sm space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Sistema Utilizado:
                </span>
                <h5 className="text-base font-bold text-white">
                  {spotlightComment.systemTitle || 'TechPOS Pro'}
                </h5>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-1">5.0 Impecável</span>
                </div>
                <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Implementação:</span>
                  <span className="text-slate-200 font-mono">100% Homologado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Pesquisar por comércio, cidade ou palavra..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {sectors.slice(0, 5).map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedSector === sec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* City Dropdown */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Cidade:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {citiesMozambique.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <p className="text-sm font-bold text-slate-800">Nenhuma avaliação encontrada</p>
            <p className="text-xs text-slate-500 mt-1">
              Tente redefinir os filtros de ramo ou cidade para ver todos os testemunhos.
            </p>
            <button
              onClick={() => {
                setSelectedSector('Todos');
                setSelectedCity('Todas');
                setSearchFilter('');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComments.map((comm) => {
              const currentHelpful =
                (comm.helpfulCount || 0) + (helpfulVotes[comm.id] || 0);

              return (
                <div
                  key={comm.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Business sector badge & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      {comm.impactMetric ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span>{comm.impactMetric}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          {comm.businessSector || 'Comércio Retalhista'}
                        </span>
                      )}

                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-amber-900">
                          {comm.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Quotation text */}
                    <div className="relative mb-6">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        "{comm.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Author Info, System, and Helpful Button */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                          {comm.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{comm.userName}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          </h4>
                          <p className="text-[11px] text-slate-600 font-semibold truncate max-w-[170px]">
                            {comm.userCompany}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            <span>{comm.city}</span>
                          </p>
                        </div>
                      </div>

                      {comm.systemTitle && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl shrink-0 text-right">
                          {comm.systemTitle}
                        </span>
                      )}
                    </div>

                    {/* Footer Row: Date & Interactive Helpful Button */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                      <span>{comm.date}</span>

                      <button
                        onClick={() => handleVoteHelpful(comm.id)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition px-2 py-1 rounded-lg hover:bg-blue-50"
                        title="Votar como avaliação útil"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="font-semibold">{currentHelpful} acharam útil</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add Review with Real-Time Interactive Card Preview */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Avaliar um Sistema TechVisions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Partilhe a experiência do seu comércio com outros empresários em Moçambique.
                  </p>
                </div>
              </div>

              {submittedFeedback ? (
                <div className="p-10 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 my-6">
                  <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold">Muito obrigado pelo seu testemunho!</h4>
                  <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                    A sua avaliação foi registada com sucesso e já está disponível para consulta no mural público da TechVisions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                  {/* Form Column */}
                  <form onSubmit={handleSubmitReview} className="lg:col-span-7 space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Classificação Geral
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">
                          {rating === 5 ? '5.0 Excelente' : `${rating}.0 de 5 estrelas`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          O seu Nome / Gerente
                        </label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Ex: Armindo Tembe"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Nome da Empresa / Loja
                        </label>
                        <input
                          type="text"
                          required
                          value={userCompany}
                          onChange={(e) => setUserCompany(e.target.value)}
                          placeholder="Ex: Padaria Flor da Matola"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Cidade / Localização
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {citiesMozambique.filter((c) => c !== 'Todas').map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Ramo de Actividade
                        </label>
                        <select
                          value={businessSector}
                          onChange={(e) => setBusinessSector(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {sectors.filter((s) => s !== 'Todos').map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Sistema Utilizado
                        </label>
                        <select
                          value={systemId}
                          onChange={(e) => setSystemId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {systems.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Maior Impacto / Resultado (Opcional)
                        </label>
                        <input
                          type="text"
                          value={impactMetric}
                          onChange={(e) => setImpactMetric(e.target.value)}
                          placeholder="Ex: -15% quebras, fecho em 5min"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        O seu Testemunho / Experiência
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Conte como o sistema melhorou as vendas, a facilidade do M-Pesa, o controlo de stock ou a rapidez no atendimento..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-bold"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publicar Avaliação</span>
                      </button>
                    </div>
                  </form>

                  {/* Live Card Preview Column */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        Pré-visualização em Tempo Real
                      </span>

                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {impactMetric || 'Resultado Comprovado'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-amber-900">{rating}.0</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 italic leading-relaxed min-h-[60px]">
                          "{commentText || 'O seu testemunho aparecerá aqui com este design sofisticado...'}"
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            {(userName || 'U').charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <span>{userName || 'O Seu Nome'}</span>
                              <BadgeCheck className="w-3 h-3 text-blue-600" />
                            </h5>
                            <p className="text-[10px] text-slate-500">
                              {userCompany || 'O Seu Estabelecimento'} • {city.split(' ')[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Avaliação protegida com selo de verificação TechVisions.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

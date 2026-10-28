import React, { useState, useEffect } from 'react';
import { SystemProduct } from '../types';
import { formatMZN } from '../utils/pricing';
import { getSystemDetails, resolveVideoPlayerSource } from '../utils/systemDetails';
import {
  X,
  ExternalLink,
  Printer,
  CheckCircle,
  Plus,
  Trash2,
  ShoppingBag,
  Store,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Video,
  Award,
  Layers,
  Info,
  Zap,
  ShieldCheck,
  Smartphone,
  WifiOff,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MonitorPlay,
  Volume2,
  Check,
} from 'lucide-react';

interface InteractiveDemoModalProps {
  system: SystemProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (system: SystemProduct) => void;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  system,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'simulator' | 'faq' | 'specs'>('overview');
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [videoDisplayMode, setVideoDisplayMode] = useState<'player' | 'walkthrough'>('player');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoProgress, setVideoProgress] = useState(18);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  // Simulator state
  const [posCart, setPosCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Artigo Demonstração 1', price: 150, qty: 2 },
    { name: 'Artigo Demonstração 2', price: 450, qty: 1 },
  ]);
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  const [fiadoSavedMsg, setFiadoSavedMsg] = useState('');
  const [selectedTable, setSelectedTable] = useState('Mesa 04 (Esplanada)');
  const [clientFiadoName] = useState('Dona Maria (Conta Fiado)');

  useEffect(() => {
    if (isOpen && system) {
      setActiveTab('overview');
      setSelectedVideoIdx(0);
      setVideoDisplayMode('player');
      setIsPlayingVideo(true);
      setVideoProgress(15);
      setReceiptPrinted(false);
      setFiadoSavedMsg('');
      setOpenFaqIndices([0]);
    }
  }, [isOpen, system?.id]);

  // Animated progress timer for interactive demo video player
  useEffect(() => {
    if (!isOpen || !isPlayingVideo) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        const next = prev + (playbackSpeed === 1.5 ? 3 : 2);
        return next >= 100 ? 0 : next;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isOpen, isPlayingVideo, playbackSpeed, selectedVideoIdx]);

  if (!isOpen || !system) return null;

  const details = getSystemDetails(system);
  const faqList = system.faqs && system.faqs.length > 0 ? system.faqs : details.faqs;

  const toggleFaqItem = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const allFaqsExpanded = faqList.length > 0 && openFaqIndices.length === faqList.length;
  const toggleAllFaqs = () => {
    if (allFaqsExpanded) {
      setOpenFaqIndices([]);
    } else {
      setOpenFaqIndices(faqList.map((_, idx) => idx));
    }
  };

  const currentVideo = details.demoVideos[selectedVideoIdx] || details.demoVideos[0];
  const effectiveVideoUrl = currentVideo?.videoUrl || system.videoUrl || details.videoUrl;
  const playerSource = resolveVideoPlayerSource(effectiveVideoUrl);
  const hasRealVideoPlayer = playerSource.type === 'youtube' || playerSource.type === 'video';

  const videoSteps = currentVideo?.steps && currentVideo.steps.length > 0
    ? currentVideo.steps
    : details.whatItDoes;
  const activeStepIdx = Math.min(
    Math.floor((videoProgress / 100) * videoSteps.length),
    videoSteps.length - 1
  );

  // Preset demo goods based on system category
  const getDemoPresets = () => {
    switch (system.category) {
      case 'Padaria':
        return [
          { name: 'Pão de Carcaça (Unidade)', price: 12 },
          { name: 'Pão Doce Tradicional', price: 20 },
          { name: 'Bolo de Aniversário Recheado', price: 950 },
          { name: 'Pastel de Nata Fresco', price: 65 },
          { name: 'Saco Farinha Trigo 50kg (Matéria Prima)', price: 1850 },
        ];
      case 'Mercearia':
      case 'Supermercado':
        return [
          { name: 'Arroz Dona Ana 25kg', price: 1350 },
          { name: 'Óleo de Cozinha 5 Litros', price: 680 },
          { name: 'Açúcar Castelo 1kg', price: 85 },
          { name: 'Sabão em Barra Omo', price: 140 },
          { name: 'Refrigerante Coca-Cola 2L', price: 110 },
        ];
      case 'Restaurante & Bar':
        return [
          { name: 'Cerveja 2M 330ml (Gelada)', price: 90 },
          { name: 'Frango Grelhado à Zambeziana', price: 480 },
          { name: 'Camarão Tigre na Brasa', price: 850 },
          { name: 'Laurentina Preta Long Neck', price: 100 },
          { name: 'Água Mineral da Namaacha 500ml', price: 50 },
        ];
      case 'Ferragens':
      case 'Gestão de Stock & Armazém':
        return [
          { name: 'Saco Cimento Limpopo 42.5N', price: 420 },
          { name: 'Varão de Ferro 12mm (Barra 12m)', price: 650 },
          { name: 'Lata Tinta Acrílica Coral 20L', price: 3400 },
          { name: 'Tubo PVC 110mm Esgoto', price: 380 },
          { name: 'Parafuso Philips 5x50 (Caixa 100un)', price: 220 },
        ];
      case 'Loja de Roupas':
        return [
          { name: 'Camisa Casual Linho (Tamanho M / Azul)', price: 1450 },
          { name: 'Calça Jeans Slim (Tamanho 42)', price: 1850 },
          { name: 'Vestido Estampado Floral (Tamanho S)', price: 2200 },
          { name: 'Sapatilhas Desportivas (Nº 41)', price: 3100 },
        ];
      default:
        return [
          { name: 'Ordem de Serviço #1042', price: 1200 },
          { name: 'Substituição de Peça Técnica', price: 850 },
          { name: 'Fatura Proforma Fiscal', price: 2500 },
        ];
    }
  };

  const demoItems = getDemoPresets();

  const handleAddItem = (item: { name: string; price: number }) => {
    setReceiptPrinted(false);
    setFiadoSavedMsg('');
    setPosCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveItem = (name: string) => {
    setPosCart((prev) => prev.filter((i) => i.name !== name));
  };

  const posTotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const renderVideoSection = () => (
    <div
      data-testid="demo-modal-videos-section"
      className="bg-slate-950 text-white rounded-3xl border border-slate-800 overflow-hidden shadow-xl"
    >
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
              Vídeos de Demonstração do Sistema
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">
              Veja o {system.title} em Ação ({details.demoVideos.length} Vídeos Disponíveis)
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {hasRealVideoPlayer && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                data-testid="demo-mode-player-btn"
                onClick={() => setVideoDisplayMode('player')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  videoDisplayMode === 'player'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>
                  {playerSource.type === 'youtube' ? 'Player YouTube' : 'Player de Vídeo'}
                </span>
              </button>
              <button
                type="button"
                data-testid="demo-mode-walkthrough-btn"
                onClick={() => setVideoDisplayMode('walkthrough')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  videoDisplayMode === 'walkthrough'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Tour por Etapas</span>
              </button>
            </div>
          )}

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Demonstração Guiada HD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Main Interactive Video Player */}
        <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          {hasRealVideoPlayer && videoDisplayMode === 'player' ? (
            <div
              data-testid="demo-video-player-container"
              className="space-y-3"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl">
                {playerSource.type === 'youtube' ? (
                  <iframe
                    key={playerSource.src}
                    data-testid="demo-youtube-iframe"
                    src={playerSource.src}
                    title={currentVideo?.title || `Demonstração ${system.title}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={playerSource.src}
                    data-testid="demo-native-video"
                    src={playerSource.src}
                    poster={currentVideo?.thumbnailUrl || system.imageUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Active Video Caption & Quick Walkthrough Steps Bar below Player */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-600/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase">
                      {playerSource.type === 'youtube' ? 'YouTube HD' : 'Vídeo Nativo MP4'}
                    </span>
                    <span className="text-[11px] font-bold text-blue-300">
                      {currentVideo?.category} • {currentVideo?.duration || '02:45'}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    {currentVideo?.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {currentVideo?.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setVideoDisplayMode('walkthrough')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold shrink-0 flex items-center gap-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Etapas Guiadas</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              data-testid="demo-video-player-stage"
              className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 aspect-video flex flex-col justify-between select-none"
            >
              {/* Background System Visual */}
              <img
                src={currentVideo?.thumbnailUrl || system.imageUrl}
                alt={currentVideo?.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                  isPlayingVideo ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/60" />

              {/* Top Overlay Bar inside Video */}
              <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                    <MonitorPlay className="w-3 h-3" />
                    VÍDEO {selectedVideoIdx + 1}/{details.demoVideos.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-white/15 text-blue-200 text-[10px] font-bold">
                    {currentVideo?.category}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 border border-white/15 text-slate-300 font-mono text-[11px] font-bold">
                  {currentVideo?.duration || '02:45'}
                </span>
              </div>

              {/* Center Interactive Demo Stage showing live step walkthrough */}
              <div className="relative z-10 px-4 sm:px-6 my-auto">
                <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Etapa {activeStepIdx + 1} de {videoSteps.length} em Execução no Sistema
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">
                      {formatMZN(system.price)} • Licença Vitalícia
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white leading-snug mb-3">
                    {currentVideo?.title}
                  </h4>

                  {/* Step-by-step live visual list inside video frame */}
                  <div className="space-y-1.5">
                    {videoSteps.map((stepText, sIdx) => {
                      const isCurrentStep = sIdx === activeStepIdx;
                      const isDoneStep = sIdx < activeStepIdx;
                      return (
                        <div
                          key={sIdx}
                          onClick={() =>
                            setVideoProgress(Math.floor((sIdx / videoSteps.length) * 100) + 5)
                          }
                          className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-all ${
                            isCurrentStep
                              ? 'bg-blue-600/30 border border-blue-400/50 text-white font-bold shadow-sm'
                              : isDoneStep
                                ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-200'
                                : 'bg-slate-900/50 border border-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isCurrentStep
                                ? 'bg-blue-500 text-white animate-pulse'
                                : isDoneStep
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isDoneStep ? <Check className="w-3 h-3" /> : sIdx + 1}
                          </span>
                          <span className="line-clamp-1">{stepText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Video Player Controls */}
              <div className="relative z-10 p-3.5 sm:p-4 bg-slate-950/90 border-t border-white/10 space-y-2">
                {/* Progress Bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(
                      0,
                      Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100))
                    );
                    setVideoProgress(pct);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer group"
                  title="Clique para avançar ou recuar no vídeo de demonstração"
                >
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid="demo-video-play-toggle"
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition"
                    >
                      {isPlayingVideo ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Reproduzir</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVideoProgress(0);
                        setIsPlayingVideo(true);
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Reiniciar vídeo"
                      aria-label="Reiniciar vídeo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : 1)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-bold"
                      title="Velocidade de reprodução"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">
                      {currentVideo?.description}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Playlist of Demo Videos for this Software */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-slate-900/50 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Lista de Vídeos deste Programa ({details.demoVideos.length})
            </span>

            <div className="space-y-2">
              {details.demoVideos.map((vid, idx) => {
                const isSelected = idx === selectedVideoIdx;
                return (
                  <button
                    key={vid.id || idx}
                    type="button"
                    data-testid={`demo-video-playlist-item-${idx}`}
                    onClick={() => {
                      setSelectedVideoIdx(idx);
                      setVideoProgress(10);
                      setIsPlayingVideo(true);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 shadow-lg shadow-blue-950/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-black text-xs ${
                        isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider truncate">
                          {vid.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {vid.duration}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {vid.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {vid.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 space-y-2">
            <p className="text-xs font-bold text-blue-200">
              Quer experimentar você mesmo os botões do sistema?
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Abrir Simulador Interativo de Balcão</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFaqSection = () => (
    <div
      data-testid="demo-faq-section"
      className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 block">
              Perguntas Frequentes (FAQ) • {system.category}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Dúvidas Comuns Sobre o {system.title} ({faqList.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clique em qualquer pergunta abaixo para expandir ou recolher a explicação detalhada.
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="demo-faq-toggle-all"
          onClick={toggleAllFaqs}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center transition shrink-0"
        >
          {allFaqsExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
              <span>Recolher Todas</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              <span>Expandir Todas ({faqList.length})</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2.5">
        {faqList.map((faq, idx) => {
          const isExpanded = openFaqIndices.includes(idx);
          return (
            <div
              key={idx}
              data-testid={`demo-faq-item-${idx}`}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                data-testid={`demo-faq-toggle-${idx}`}
                aria-expanded={isExpanded}
                onClick={() => toggleFaqItem(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    {faq.category && (
                      <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mb-1">
                        {faq.category}
                      </span>
                    )}
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                      {faq.question}
                    </h4>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div
                  data-testid={`demo-faq-answer-${idx}`}
                  className="px-4 pb-4 pt-1 pl-13 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-amber-200/60"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      data-testid="interactive-demo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Fechar janela"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-0.5 rounded-full border border-blue-400/30">
              Categoria Principal: {system.category}
            </span>
            {system.badges?.map((b, idx) => (
              <span
                key={idx}
                className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30"
              >
                {b}
              </span>
            ))}
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Informações, Vantagens & Vídeos Demo
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight pr-10">
            {system.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            {system.description}
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 pt-3 border-t border-white/10 text-xs font-bold">
            <button
              type="button"
              data-testid="demo-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Sobre o Programa, Vantagens & Categorias</span>
            </button>

            <button
              type="button"
              data-testid="demo-tab-videos"
              onClick={() => setActiveTab('videos')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'videos'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeos de Demonstração ({details.demoVideos.length})</span>
            </button>

            <button
              type="button"
              data-testid="demo-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Testar Simulador POS ao Vivo</span>
            </button>

            <button
              type="button"
              data-testid="demo-tab-faq"
              onClick={() => setActiveTab('faq')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'faq'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Perguntas Frequentes ({faqList.length})</span>
            </button>

            <button
              type="button"
              data-testid="demo-tab-specs"
              onClick={() => setActiveTab('specs')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'specs'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ficha Técnica & Hardware</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          {activeTab === 'overview' && (
            <div data-testid="demo-overview-content" className="space-y-6">
              {/* 1. Detalhes Sobre o Programa & O Que Ele Faz */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[210px] bg-slate-900">
                  <img
                    src={system.imageUrl}
                    alt={system.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {system.isMobileSupported && (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[10px] font-black flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> Mobile & Tablet
                        </span>
                      )}
                      {system.specs?.offlineMode && (
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/90 text-white text-[10px] font-black flex items-center gap-1">
                          <WifiOff className="w-3 h-3" /> 100% Offline
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-200">
                      Plataforma: {system.specs?.platform || 'Web, Windows & Android'}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                      1. Detalhes Sobre o Programa & O Que Ele Faz
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Como o {system.title} transforma a sua operação
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {details.overview}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      O que este sistema faz no dia a dia:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {details.whatItDoes.map((item, idx) => (
                        <div
                          key={idx}
                          data-testid="demo-what-it-does-item"
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-800"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Quais São as Vantagens do Programa */}
              <div
                data-testid="demo-advantages-section"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 block">
                      2. Vantagens & Benefícios Diretos
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>Por que escolher o {system.title}?</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    Retorno Garantido para o seu Negócio
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {details.advantages.map((adv, idx) => (
                    <div
                      key={idx}
                      data-testid="demo-advantage-card"
                      className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200/80 flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">
                            {adv.title}
                          </h4>
                        </div>
                        {adv.metric && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shrink-0">
                            {adv.metric}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Quais São as Categorias e Módulos que Oferece */}
              <div
                data-testid="demo-offered-categories-section"
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                      3. Categorias, Setores & Módulos Oferecidos
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      <span>Categorias e Áreas que o Programa Abrange</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                    {details.offeredCategories.length} Categorias / Módulos Incluídos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {details.offeredCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      data-testid="demo-offered-category-card"
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 transition flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          {cat.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Vídeos de Demonstração do Sistema em Questão */}
              {renderVideoSection()}

              {/* 5. Perguntas Frequentes Retráteis (FAQ) do Sistema */}
              {renderFaqSection()}
            </div>
          )}

          {activeTab === 'videos' && renderVideoSection()}

          {activeTab === 'faq' && renderFaqSection()}

          {activeTab === 'simulator' && (
            <div data-testid="demo-simulator-content" className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Panel: Catalogo de Teste */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-blue-600" />
                    Toque nos artigos para lançar na venda ({system.category}):
                  </h3>
                  <span className="text-xs text-gray-500">Modo Balcão Moçambique</span>
                </div>

                {system.category === 'Restaurante & Bar' && (
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2 text-xs flex-wrap">
                    <span className="font-semibold text-gray-700">Mesa:</span>
                    {['Mesa 01', 'Mesa 04 (Esplanada)', 'Balcão Bar', 'VIP 02'].map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedTable(tbl)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          selectedTable === tbl
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {demoItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddItem(item)}
                      className="bg-white p-3 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left flex flex-col justify-between group active:scale-95"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">
                          {item.name}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition shrink-0 ml-1">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-blue-900 mt-2">
                        {formatMZN(item.price)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Fiado simulation for Mercearia */}
                {system.category === 'Mercearia' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold">Módulo de Caderno de Crédito (Fiado):</span>
                        <p className="text-amber-700 text-[11px]">
                          Atribuído a: <span className="underline font-semibold">{clientFiadoName}</span>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFiadoSavedMsg(
                            `Conta de fiado de ${clientFiadoName} atualizada com saldo pendente de ${formatMZN(posTotal)}!`
                          )
                        }
                        className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition"
                      >
                        Lançar Fiado
                      </button>
                    </div>
                    {fiadoSavedMsg && (
                      <div className="p-2 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 font-semibold text-[11px]">
                        {fiadoSavedMsg}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Panel: Caixa & Talão Térmico */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Terminal de Caixa #{system.category}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Operador: Caixa 01
                    </span>
                  </div>

                  {posCart.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Nenhum artigo adicionado.<br />Clique nos produtos ao lado para simular.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                      {posCart.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100">
                          <div className="flex-1 pr-2">
                            <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-gray-400 text-[11px]">
                              {item.qty}x @ {formatMZN(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {formatMZN(item.price * item.qty)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.name)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="flex items-center justify-between text-base font-extrabold text-blue-950 mb-3">
                    <span>Total da Venda:</span>
                    <span>{formatMZN(posTotal)}</span>
                  </div>

                  {receiptPrinted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-800 mb-2">
                      <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                      Talão de Venda e Recibo Fiscal impresso com sucesso!
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReceiptPrinted(true)}
                      disabled={posCart.length === 0}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Simular Talão
                    </button>
                    <button
                      onClick={() => {
                        setPosCart([]);
                        setReceiptPrinted(false);
                      }}
                      className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      Limpar Caixa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div data-testid="demo-specs-content" className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Funcionalidades Técnicas Incluídas:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {system.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {system.specs && (
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Requisitos e Compatibilidade Técnica:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-1">Plataformas:</span>
                      <span className="font-semibold text-gray-800">{system.specs.platform}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Modo Offline:</span>
                      <span className="font-semibold text-emerald-600">
                        {system.specs.offlineMode ? '100% Suportado' : 'Requer Conexão'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Hardware:</span>
                      <span className="font-semibold text-gray-800">
                        {system.specs.hardwareSupport.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Idioma:</span>
                      <span className="font-semibold text-gray-800">
                        {system.specs.languages.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-500 block">Licença Vitalícia com Suporte Técnico:</span>
            <span className="text-xl font-extrabold text-blue-900">
              {formatMZN(system.price)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
            {activeTab !== 'simulator' && (
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Simular Venda POS</span>
              </button>
            )}

            <a
              href={system.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Abrir Demo Externa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                onAddToCart(system);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Adquirir Este Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

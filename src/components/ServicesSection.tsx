import React, { useState } from 'react';
import { CompanyServiceItem, CompanySettings } from '../types';
import {
  filterActiveServices,
  getServiceCategoryList,
  formatServiceWhatsAppMessage,
} from '../utils/services';
import {
  Briefcase,
  Server,
  Mail,
  Code2,
  Boxes,
  Smartphone,
  HardDrive,
  Shield,
  Printer,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Users,
  MessageCircle,
  FileText,
  Clock,
  MapPin,
  X,
  Send,
  Building,
  Check,
  Phone,
  Search,
} from 'lucide-react';

interface ServicesSectionProps {
  services: CompanyServiceItem[];
  companySettings?: CompanySettings;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  companySettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<CompanyServiceItem | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote form state
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [city, setCity] = useState('Maputo');
  const [urgency, setUrgency] = useState<'baixa' | 'media' | 'alta' | 'imediata'>('alta');
  const [details, setDetails] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [quoteProtocol, setQuoteProtocol] = useState('');

  const categories = getServiceCategoryList(services);
  const filteredServices = filterActiveServices(services, selectedCategory, searchQuery);

  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Server':
        return <Server className={className} />;
      case 'Mail':
        return <Mail className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Boxes':
        return <Boxes className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'HardDrive':
        return <HardDrive className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Printer':
        return <Printer className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Briefcase className={className} />;
    }
  };

  const handleOpenQuoteModal = (service: CompanyServiceItem) => {
    setSelectedService(service);
    setIsSubmittedSuccess(false);
    setIsQuoteModalOpen(true);
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName.trim() || !clientPhone.trim()) {
      alert('Por favor preencha pelo menos o seu nome e contacto de telemóvel.');
      return;
    }

    const message = formatServiceWhatsAppMessage({
      serviceTitle: selectedService.title,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      companyName: companyName.trim(),
      city: city.trim(),
      urgency,
      details: details.trim(),
    });

    const targetPhone = (companySettings?.whatsapp || '+258 84 000 0000').replace(/[^0-9]/g, '');
    const cleanPhone = targetPhone.startsWith('258') ? targetPhone : `258${targetPhone}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Also persist in local quote requests
    saveLocalQuoteRequest();
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName.trim() || !clientPhone.trim()) {
      alert('Por favor preencha o seu nome e telefone.');
      return;
    }

    saveLocalQuoteRequest();
  };

  const saveLocalQuoteRequest = () => {
    if (!selectedService) return;
    const protocol = `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newQuote = {
      id: `quote-${Date.now()}`,
      protocol,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      clientName: clientName.trim(),
      companyName: companyName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      city: city.trim(),
      details: details.trim(),
      urgency,
      createdAt: new Date().toISOString(),
      status: 'NOVO',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tv_quote_requests') || '[]');
      localStorage.setItem('tv_quote_requests', JSON.stringify([newQuote, ...existing]));
    } catch {
      // ignore
    }

    setQuoteProtocol(protocol);
    setIsSubmittedSuccess(true);
  };

  return (
    <section id="servicos-section" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Soluções Corporativas &amp; Tecnológicas</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Nossos Serviços para Modernizar a sua Empresa
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Muito mais do que software de balcão: fornecemos consumíveis e material de escritório, criamos servidores locais e na nuvem, configuramos emails corporativos, desenvolvemos programas web e mobile e organizamos o seu armazém e stock.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 max-w-md mx-auto my-6 shadow-xs">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900">Nenhum serviço encontrado</h3>
            <p className="text-xs text-gray-500 mt-1">
              Não encontramos serviços para a categoria ou termo "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Ver Todos os Serviços
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-400"
              >
                <div>
                  {/* Image / Header Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Badge */}
                    {service.badge && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                          {service.badge}
                        </span>
                      </div>
                    )}

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-900 text-[10px] font-bold border border-white/50">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {renderIcon(service.icon, 'w-5 h-5')}
                      </div>
                      <h3 className="font-black text-gray-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>

                    {/* Key Features Checklist */}
                    <div className="space-y-1.5 pt-1">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Target Audience note */}
                    {service.targetAudience && (
                      <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">Indicado: {service.targetAudience}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 sm:p-6 pt-0 space-y-3 border-t border-gray-100/80 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs pt-3">
                    <span className="text-gray-400 font-medium">Condições:</span>
                    <span className="font-bold text-blue-900 truncate ml-2">
                      {service.pricingNote || 'Sob Consulta'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenQuoteModal(service)}
                      className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <span>{service.contactCtaText || 'Pedir Cotação'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setIsQuoteModalOpen(true);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-gray-700 text-xs font-bold transition border border-gray-200 flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Why Choose TechVisions Services Banner */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Building className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white">Parceiro Único de TI em Moçambique</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Não precisa de contratar múltiplos fornecedores: a TechVisions trata dos equipamentos, dos cabos e servidores, do email oficial e do software da sua empresa com faturação legal e NUIT.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white">Equipa no Terreno &amp; Resposta Rápida</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Técnicos especializados para intervenção física em Maputo, Matola e suporte remoto imediato para todas as províncias do país, com contratos de manutenção preventiva.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white">Foco na Continuidade do Seu Negócio</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Garantimos que o seu armazém nunca perca mercadorias por desorganização e que os seus dados permaneçam salvos com servidores de arquivos e backups automáticos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE DETAILS & QUOTE MODAL */}
      {isQuoteModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 text-xs my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  {renderIcon(selectedService.icon, 'w-6 h-6')}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {selectedService.category}
                  </span>
                  <h3 className="font-black text-gray-900 text-base sm:text-lg">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedService.pricingNote}</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-gray-900 text-lg">
                    Pedido de Cotação Registado com Sucesso!
                  </h4>
                  <p className="text-xs text-gray-500">
                    Protocolo: <strong className="font-mono text-blue-600">{quoteProtocol}</strong>
                  </p>
                  <p className="text-xs text-gray-600 max-w-md mx-auto pt-2">
                    Agradecemos o seu interesse no serviço <strong>{selectedService.title}</strong>. A nossa equipa comercial entrará em contacto através do telemóvel <strong>{clientPhone}</strong> nas próximas horas úteis.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    Fechar e Continuar a Navegar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Description & Deliverables */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-gray-900 text-xs">Visão Geral da Solução:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedService.fullDescription}
                  </p>

                  {selectedService.deliverables && selectedService.deliverables.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-bold text-gray-800 text-[11px] block mb-1">
                        O que a sua empresa recebe:
                      </span>
                      <ul className="space-y-1">
                        {selectedService.deliverables.map((deliv, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Form to Request Quote */}
                <form onSubmit={handleDirectSubmit} className="space-y-4">
                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="font-black text-gray-900 text-xs mb-1">
                      Preencha os seus dados para receber a proposta:
                    </h4>
                    <p className="text-[11px] text-gray-500 mb-3">
                      Pode enviar instantaneamente para o nosso WhatsApp oficial ou submeter diretamente no sistema.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Armando Cossa"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: Supermercado Estrela Lda"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Telemóvel / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+258 84/85/86/87..."
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Email de Contacto</label>
                      <input
                        type="email"
                        placeholder="contacto@empresa.co.mz"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Cidade / Província</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                      >
                        <option value="Maputo Cidade">Maputo Cidade</option>
                        <option value="Matola">Matola</option>
                        <option value="Beira">Beira</option>
                        <option value="Nampula">Nampula</option>
                        <option value="Tete">Tete</option>
                        <option value="Quelimane">Quelimane</option>
                        <option value="Chimoio">Chimoio</option>
                        <option value="Pemba">Pemba</option>
                        <option value="Inhambane">Inhambane</option>
                        <option value="Outra Província">Outra Província</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Descreva as necessidades específicas da sua empresa (opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Precisamos de servidores para 10 computadores na rede local de armazém, com emails corporativos para a gerência..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200"
                    />
                  </div>

                  {/* Urgency */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-gray-700">Urgência:</span>
                    {(['imediata', 'alta', 'media', 'baixa'] as const).map((lvl) => (
                      <label key={lvl} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          checked={urgency === lvl}
                          onChange={() => setUrgency(lvl)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize text-gray-700 text-[11px]">{lvl}</span>
                      </label>
                    ))}
                  </div>

                  {/* Submission Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Falar no WhatsApp Oficial</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submeter Pedido de Cotação</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

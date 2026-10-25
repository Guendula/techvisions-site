import React, { useState } from 'react';
import { CompanyServiceItem, ServiceCategory } from '../types';
import { validateServiceItem, calculateServicesStats } from '../utils/services';
import {
  Briefcase,
  Server,
  Mail,
  Code2,
  Boxes,
  Smartphone,
  HardDrive,
  Shield,
  Cpu,
  Printer,
  Sparkles,
  PlusCircle,
  RotateCcw,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  Tag,
  DollarSign,
  Users,
  Check,
  X,
  Eye,
  EyeOff,
  Building,
} from 'lucide-react';

interface AdminServicesSectionProps {
  services: CompanyServiceItem[];
  onAddService: (newService: CompanyServiceItem) => void;
  onUpdateService: (updatedService: CompanyServiceItem) => void;
  onDeleteService: (id: string) => void;
  onResetServices?: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'Briefcase', label: 'Escritório', icon: Briefcase },
  { id: 'Server', label: 'Servidor', icon: Server },
  { id: 'Mail', label: 'Email', icon: Mail },
  { id: 'Code2', label: 'Código/Software', icon: Code2 },
  { id: 'Boxes', label: 'Stock/Caixas', icon: Boxes },
  { id: 'Smartphone', label: 'Mobile/App', icon: Smartphone },
  { id: 'HardDrive', label: 'Disco/Storage', icon: HardDrive },
  { id: 'Shield', label: 'Segurança', icon: Shield },
  { id: 'Printer', label: 'Impressora/POS', icon: Printer },
  { id: 'Cpu', label: 'Hardware/TI', icon: Cpu },
  { id: 'Sparkles', label: 'Inovação', icon: Sparkles },
];

const PRESET_IMAGES = [
  {
    label: 'Material de Escritório & Papelaria',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Servidores & Datacenter',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Email Corporativo & Comunicação',
    url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Programação Web & Mobile',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Armazém & Gestão de Stock',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Suporte Técnico e Redes',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  },
];

const CATEGORY_OPTIONS: ServiceCategory[] = [
  'Escritório & Hardware',
  'Servidores & Redes',
  'Comunicação Corporativa',
  'Software & Mobile',
  'Gestão & Consultoria',
];

export const AdminServicesSection: React.FC<AdminServicesSectionProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetServices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Escritório & Hardware');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [featuresText, setFeaturesText] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [pricingType, setPricingType] = useState<'quote' | 'fixed' | 'hourly' | 'subscription'>('quote');
  const [pricingNote, setPricingNote] = useState('');
  const [badge, setBadge] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [contactCtaText, setContactCtaText] = useState('Solicitar Cotação');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const stats = calculateServicesStats(services);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Escritório & Hardware');
    setShortDescription('');
    setFullDescription('');
    setIcon('Briefcase');
    setFeaturesText(
      'Atendimento presencial e suporte técnico dedicado\nCotação imediata em Meticais (MZN)\nEmissão de faturas com NUIT'
    );
    setDeliverablesText('Relatório técnico\nGarantia de serviço');
    setTargetAudience('Empresas, Escritórios e Comércio em Moçambique');
    setPricingType('quote');
    setPricingNote('Sob Consulta');
    setBadge('Destaque');
    setOrder(services.length + 1);
    setContactCtaText('Solicitar Cotação');
    setImageUrl(PRESET_IMAGES[0].url);
    setIsActive(true);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: CompanyServiceItem) => {
    setEditingId(s.id);
    setTitle(s.title);
    setCategory(s.category);
    setShortDescription(s.shortDescription);
    setFullDescription(s.fullDescription);
    setIcon(s.icon || 'Briefcase');
    setFeaturesText(s.features.join('\n'));
    setDeliverablesText(s.deliverables ? s.deliverables.join('\n') : '');
    setTargetAudience(s.targetAudience || '');
    setPricingType(s.pricingType);
    setPricingNote(s.pricingNote || '');
    setBadge(s.badge || '');
    setOrder(s.order);
    setContactCtaText(s.contactCtaText || 'Solicitar Cotação');
    setImageUrl(s.imageUrl || '');
    setIsActive(s.isActive);
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const deliverables = deliverablesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const serviceData: Partial<CompanyServiceItem> = {
      title: title.trim(),
      category: category.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      icon,
      features,
      deliverables,
      targetAudience: targetAudience.trim() || undefined,
      pricingType,
      pricingNote: pricingNote.trim() || 'Sob Consulta',
      badge: badge.trim() || undefined,
      isActive,
      order,
      contactCtaText: contactCtaText.trim() || 'Solicitar Cotação',
      imageUrl: imageUrl.trim() || undefined,
    };

    const validation = validateServiceItem(serviceData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingId) {
      onUpdateService({
        ...(serviceData as CompanyServiceItem),
        id: editingId,
      });
      alert(`Serviço "${title}" atualizado com sucesso!`);
    } else {
      const newId = `serv-${Date.now()}`;
      onAddService({
        ...(serviceData as CompanyServiceItem),
        id: newId,
      });
      alert(`Novo serviço "${title}" adicionado ao sistema!`);
    }

    setIsModalOpen(false);
  };

  const filteredServices = services
    .filter((s) => {
      if (selectedCategory !== 'Todos' && s.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.order - b.order);

  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
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

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Gestão de Serviços Oferecidos aos Clientes
              </h2>
              <p className="text-xs text-gray-500">
                Configure os serviços prestados pela TechVisions (Material de escritório, Servidores, Emails, Programas Web/Mobile e Gestão de Stock).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onResetServices && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Deseja restaurar os 5 serviços padrão (Material de Escritório, Servidores, Email Corporativo, Programas e Gestão de Stock)?'
                  )
                ) {
                  onResetServices();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Serviços Padrão</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-gray-400 font-bold block text-[11px]">Total de Serviços</span>
          <span className="text-xl font-black text-gray-900 mt-0.5 block">{stats.total}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
          <span className="text-emerald-600 font-bold block text-[11px]">Serviços Ativos (Visíveis)</span>
          <span className="text-xl font-black text-emerald-900 mt-0.5 block">{stats.active}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
          <span className="text-amber-700 font-bold block text-[11px]">Inativos / Rascunhos</span>
          <span className="text-xl font-black text-amber-900 mt-0.5 block">{stats.inactive}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
          <span className="text-blue-700 font-bold block text-[11px]">Categorias de Serviço</span>
          <span className="text-xl font-black text-blue-900 mt-0.5 block">{stats.categoriesCount}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por título, categoria ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['Todos', ...CATEGORY_OPTIONS].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List / Grid */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-3xl bg-slate-50/50">
            <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-700">Nenhum serviço encontrado com os filtros atuais.</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Tente limpar a pesquisa ou restaurar os serviços padrão.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                service.isActive
                  ? 'bg-white border-gray-200 shadow-xs hover:border-blue-300'
                  : 'bg-slate-50/70 border-gray-200/60 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    {renderIcon(service.icon, 'w-5 h-5')}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-gray-900 text-sm">{service.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {service.category}
                      </span>
                      {service.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {service.badge}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          service.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {service.isActive ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        <span>{service.isActive ? 'Ativo na Página' : 'Inativo / Oculto'}</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Ordem: #{service.order}</span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 max-w-3xl leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-gray-500">
                      {service.pricingNote && (
                        <span className="flex items-center gap-1 font-semibold text-blue-800">
                          <DollarSign className="w-3 h-3 text-blue-600" />
                          <span>{service.pricingNote}</span>
                        </span>
                      )}
                      {service.targetAudience && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span>Público: {service.targetAudience}</span>
                        </span>
                      )}
                      <span className="text-gray-400 font-mono">
                        {service.features.length} benefícios cadastrados
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => onUpdateService({ ...service, isActive: !service.isActive })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                      service.isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={service.isActive ? 'Ocultar serviço do site' : 'Tornar serviço visível no site'}
                  >
                    {service.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{service.isActive ? 'Desativar' : 'Ativar'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-200"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Tem a certeza que deseja eliminar o serviço "${service.title}"?`)) {
                        onDeleteService(service.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Eliminar serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 text-xs my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">
                    {editingId ? 'Editar Serviço Oferecido' : 'Cadastrar Novo Serviço da Empresa'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Preencha as informações técnicas, benefícios e preço visíveis aos clientes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 space-y-1">
                <span className="font-bold block">Por favor corrija os seguintes itens:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {formErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Título do Serviço *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Venda de Material de Escritório, Servidores de Email e Arquivos..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descrição Breve (Resumo no Cartão) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Resumo em 1 ou 2 frases que aparece nos cartões do site..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descrição Completa e Detalhada *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explicação aprofundada da solução técnica, processo de trabalho e vantagens para a empresa..."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 leading-relaxed"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Ícone Representativo</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = icon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setIcon(item.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[10px] truncate max-w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Benefícios / Recursos (1 por linha)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Toners e consumíveis originais&#10;Impressoras térmicas 58mm/80mm&#10;Entrega rápida em Maputo e Matola"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Cada linha será exibida como um ponto de verificação com ícone de visto verde.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Entregáveis / O que a empresa recebe (1 por linha)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Cotação formal em MZN&#10;Garantia técnica de substituição&#10;Formação à equipa de operadores"
                    value={deliverablesText}
                    onChange={(e) => setDeliverablesText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Visível no modal de detalhes do serviço.
                  </span>
                </div>
              </div>

              {/* Audience, Pricing & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Público-Alvo Indicado</label>
                  <input
                    type="text"
                    placeholder="Ex: PMEs, Escolas, Escritórios..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Indicação de Preço / Modalidade</label>
                  <input
                    type="text"
                    placeholder="Ex: Sob Consulta, A partir de 2.500 MT..."
                    value={pricingNote}
                    onChange={(e) => setPricingNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Emblema de Destaque (Badge)</label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Solicitado, Destaque..."
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Order & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Texto do Botão de Contacto</label>
                  <input
                    type="text"
                    placeholder="Ex: Solicitar Cotação, Agendar Visita..."
                    value={contactCtaText}
                    onChange={(e) => setContactCtaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">URL da Imagem de Capa</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-gray-400 self-center">Predefinições rápidas:</span>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-medium"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-bold text-gray-800">
                  Serviço Ativo e Visível publicamente na página principal
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                >
                  {editingId ? 'Gravar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

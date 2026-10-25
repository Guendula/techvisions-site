import React, { useState } from 'react';
import {
  SystemProduct,
  Order,
  ProductCategory,
  TestimonialComment,
  NewsArticle,
  PartnerIntegration,
  NavigationMenuItem,
  NavigationSubItem,
  HeroSlide,
  CompanySettings,
  SystemApiConfig,
  CategoryItem,
  SeoSettings,
  CompanyServiceItem,
} from '../types';
import { AdminSettingsSection } from './AdminSettingsSection';
import { AdminCategoriesSection } from './AdminCategoriesSection';
import { AdminSeoSection } from './AdminSeoSection';
import { AdminServicesSection } from './AdminServicesSection';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_SEO_SETTINGS } from '../data/initialSeo';
import { INITIAL_SERVICES } from '../data/initialServices';
import { formatMZN } from '../utils/pricing';
import { useAuth } from '../context/AuthContext';
import { exportSalesToGoogleSheets } from '../services/workspace';
import {
  Briefcase,
  PlusCircle,
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag,
  Search,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  BarChart3,
  CreditCard,
  Smartphone,
  Calendar,
  Layers,
  Sparkles,
  MessageSquare,
  Newspaper,
  Check,
  Star,
  Eye,
  Building,
  MapPin,
  Download,
  AlertCircle,
  Edit,
  Sliders,
  Menu,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Zap,
  Printer,
  ChevronDown,
  X,
  Play,
  Cpu,
  Server,
  Globe,
  Settings,
} from 'lucide-react';

interface AdminDashboardProps {
  systems: SystemProduct[];
  onAddSystem: (newSystem: SystemProduct) => void;
  onUpdateSystem?: (updatedSystem: SystemProduct) => void;
  onDeleteSystem: (id: string) => void;
  comments: TestimonialComment[];
  onToggleCommentApproval?: (id: string) => void;
  onDeleteComment?: (id: string) => void;
  onUpdateComment?: (comment: TestimonialComment) => void;
  news: NewsArticle[];
  onAddNews?: (news: NewsArticle) => void;
  onUpdateNews?: (news: NewsArticle) => void;
  onDeleteNews?: (id: string) => void;
  partners: PartnerIntegration[];
  onAddPartner?: (partner: PartnerIntegration) => void;
  onUpdatePartner?: (partner: PartnerIntegration) => void;
  onDeletePartner?: (id: string) => void;
  menuItems: NavigationMenuItem[];
  onAddMenuItem?: (item: NavigationMenuItem) => void;
  onUpdateMenuItem?: (item: NavigationMenuItem) => void;
  onDeleteMenuItem?: (id: string) => void;
  onResetMenuItems?: () => void;
  slides: HeroSlide[];
  onAddSlide?: (slide: HeroSlide) => void;
  onUpdateSlide?: (slide: HeroSlide) => void;
  onDeleteSlide?: (id: string) => void;
  onResetSlides?: () => void;
  companySettings?: CompanySettings;
  onUpdateCompanySettings?: (settings: CompanySettings) => void;
  apiConfig?: SystemApiConfig;
  onUpdateApiConfig?: (config: SystemApiConfig) => void;
  categories?: CategoryItem[];
  onAddCategory?: (category: CategoryItem) => void;
  onUpdateCategory?: (category: CategoryItem, oldName?: string) => void;
  onDeleteCategory?: (id: string) => void;
  seoSettings?: SeoSettings;
  onUpdateSeoSettings?: (settings: SeoSettings) => void;
  services?: CompanyServiceItem[];
  onAddService?: (service: CompanyServiceItem) => void;
  onUpdateService?: (service: CompanyServiceItem) => void;
  onDeleteService?: (id: string) => void;
  onResetServices?: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  systems,
  onAddSystem,
  onUpdateSystem,
  onDeleteSystem,
  comments,
  onToggleCommentApproval,
  onDeleteComment,
  onUpdateComment,
  news,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  partners,
  onAddPartner,
  onUpdatePartner,
  onDeletePartner,
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onResetMenuItems,
  slides,
  onAddSlide,
  onUpdateSlide,
  onDeleteSlide,
  onResetSlides,
  companySettings,
  onUpdateCompanySettings,
  apiConfig,
  onUpdateApiConfig,
  categories = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  seoSettings,
  onUpdateSeoSettings,
  services = [],
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetServices,
  onClose,
}) => {
  const effectiveCategories: CategoryItem[] = categories.length > 0 ? categories : INITIAL_CATEGORIES;
  const effectiveServices: CompanyServiceItem[] = services.length > 0 ? services : INITIAL_SERVICES;
  const { orders, googleAccessToken, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'financials'
    | 'catalog'
    | 'orders'
    | 'new-system'
    | 'categories'
    | 'services'
    | 'partners'
    | 'news'
    | 'comments'
    | 'menus'
    | 'slider'
    | 'settings'
    | 'seo'
  >('financials');

  // Google Sheets Export State
  const [isExportingSheets, setIsExportingSheets] = useState(false);
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(null);
  const [sheetNotification, setSheetNotification] = useState<string | null>(null);

  // Fallback demo orders if no checkout happened yet
  const effectiveOrders: Order[] = orders.length > 0 ? orders : [
    {
      id: 'ord-demo-1',
      orderNumber: 'TV-MZ-2026-1042',
      userId: 'usr-1',
      userName: 'Padaria & Confeitaria Estrela de Maputo',
      userEmail: 'gerencia@estrelamaputo.co.mz',
      userPhone: '+258 84 312 9000',
      items: [
        {
          systemId: 'tv-sys-padaria',
          title: 'TechPadaria Pro - Gestão & Ponto de Venda',
          category: 'Padaria',
          price: 18500,
          licenseKey: 'TV-PAD-8492-9182',
          downloadUrl: 'https://download.techvisions.co.mz/releases/padaria-v2.4.zip',
        },
      ],
      totalAmount: 18500,
      paymentMethod: 'MPESA',
      paymentStatus: 'SUCCESS',
      transactionRef: 'MPESA-MZ-984210',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-demo-2',
      orderNumber: 'TV-MZ-2026-1088',
      userId: 'usr-2',
      userName: 'Mercearia Central da Matola',
      userEmail: 'compras@matolacentral.co.mz',
      userPhone: '+258 86 555 1234',
      items: [
        {
          systemId: 'tv-sys-mercearia',
          title: 'TechPOS Mercearia & Minimercado',
          category: 'Mercearia',
          price: 14900,
          licenseKey: 'TV-MER-3141-5926',
          downloadUrl: 'https://download.techvisions.co.mz/releases/mercearia-v2.4.zip',
        },
      ],
      totalAmount: 14900,
      paymentMethod: 'EMOLA',
      paymentStatus: 'SUCCESS',
      transactionRef: 'EMOLA-MZ-441290',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ord-demo-3',
      orderNumber: 'TV-MZ-2026-1102',
      userId: 'usr-3',
      userName: 'Ferragens & Obras Polana',
      userEmail: 'financeiro@ferragenspolana.co.mz',
      userPhone: '+258 84 777 8899',
      items: [
        {
          systemId: 'tv-sys-ferragens',
          title: 'TechFerragens Pro - Obras & Retalho',
          category: 'Ferragens',
          price: 22000,
          licenseKey: 'TV-FER-9081-2244',
          downloadUrl: 'https://download.techvisions.co.mz/releases/ferragens-v2.4.zip',
        },
      ],
      totalAmount: 22000,
      paymentMethod: 'VISA',
      paymentStatus: 'SUCCESS',
      transactionRef: 'VISA-BIM-983100',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'ord-demo-4',
      orderNumber: 'TV-MZ-2026-1120',
      userId: 'usr-4',
      userName: 'Restaurante & Bar Marisco Baía',
      userEmail: 'bar@mariscobaia.co.mz',
      userPhone: '+258 84 123 4567',
      items: [
        {
          systemId: 'tv-sys-restaurante',
          title: 'TechResto & Bar - Mesas & Cozinha',
          category: 'Restaurante & Bar',
          price: 19500,
          licenseKey: 'TV-RES-5544-3322',
          downloadUrl: 'https://download.techvisions.co.mz/releases/resto-v2.4.zip',
        },
      ],
      totalAmount: 19500,
      paymentMethod: 'MPESA',
      paymentStatus: 'SUCCESS',
      transactionRef: 'MPESA-MZ-665511',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  // Financial Calculations
  const grossRevenue = effectiveOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const estimatedFees = effectiveOrders.reduce((sum, ord) => {
    const rate = ord.paymentMethod === 'VISA' ? 0.025 : 0.015;
    return sum + ord.totalAmount * rate;
  }, 0);
  const netRevenue = grossRevenue - estimatedFees;
  const averageTicket = effectiveOrders.length > 0 ? grossRevenue / effectiveOrders.length : 0;
  const vatEstimate = grossRevenue * 0.16;

  // Payments breakdown
  const mpesaTotal = effectiveOrders
    .filter((o) => o.paymentMethod === 'MPESA')
    .reduce((s, o) => s + o.totalAmount, 0);
  const emolaTotal = effectiveOrders
    .filter((o) => o.paymentMethod === 'EMOLA')
    .reduce((s, o) => s + o.totalAmount, 0);
  const visaTotal = effectiveOrders
    .filter((o) => o.paymentMethod === 'VISA')
    .reduce((s, o) => s + o.totalAmount, 0);

  const mpesaCount = effectiveOrders.filter((o) => o.paymentMethod === 'MPESA').length;
  const emolaCount = effectiveOrders.filter((o) => o.paymentMethod === 'EMOLA').length;
  const visaCount = effectiveOrders.filter((o) => o.paymentMethod === 'VISA').length;

  const handleExportToGoogleSheets = async () => {
    if (!googleAccessToken) {
      openAuthModal('Inicie sessão com a sua conta Google para exportar a planilha diretamente para o Google Sheets');
      return;
    }

    const confirmed = window.confirm(
      'Deseja criar e exportar a planilha de resumo financeiro, vendas e contratos para o seu Google Sheets?'
    );
    if (!confirmed) return;

    setIsExportingSheets(true);
    setSheetNotification(null);

    try {
      const res = await exportSalesToGoogleSheets(googleAccessToken, effectiveOrders);
      setExportedSheetUrl(res.spreadsheetUrl);
      setSheetNotification(`Planilha Google Sheets gerada com sucesso! (${effectiveOrders.length} transações financeiras e contratos exportados)`);
    } catch (err: any) {
      alert(err.message || 'Erro ao exportar para o Google Sheets.');
    } finally {
      setIsExportingSheets(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Numero_Pedido', 'Data', 'Cliente', 'Email', 'Telefone', 'Metodo', 'Valor_MZN', 'Estado', 'Referencia'];
    const rows = effectiveOrders.map((o) => [
      o.orderNumber,
      o.createdAt,
      `"${o.userName}"`,
      o.userEmail,
      o.userPhone,
      o.paymentMethod,
      o.totalAmount,
      o.paymentStatus,
      o.transactionRef,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_financeiro_techvisions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // SYSTEM / PRODUCT MANAGEMENT STATE & LOGIC
  // ==========================================
  const [editingSystemId, setEditingSystemId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Padaria');
  const [price, setPrice] = useState('18500');
  const [demoUrl, setDemoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('Modo 100% Offline com sincronização\nEmissão rápida de faturas e talões\nIntegração direta com M-Pesa e E-Mola');
  const [demoType, setDemoType] = useState<'pos' | 'bakery' | 'restaurant' | 'inventory' | 'ecommerce'>('bakery');
  const [offlineSupported, setOfflineSupported] = useState(true);
  const [mobileSupported, setMobileSupported] = useState(true);
  const [selectedHardwares, setSelectedHardwares] = useState<string[]>([
    'Impressora Térmica 58/80mm',
    'Gaveta de Dinheiro RJ11',
  ]);
  const [badgeText, setBadgeText] = useState('Recente');

  const imagePresets = [
    { label: 'Padaria / Pastelaria', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', cat: 'Padaria' as ProductCategory, type: 'bakery' as const },
    { label: 'Mercearia / Minimercado', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80', cat: 'Mercearia' as ProductCategory, type: 'pos' as const },
    { label: 'Ferragens & Obras', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80', cat: 'Ferragens' as ProductCategory, type: 'pos' as const },
    { label: 'Restaurante / Bar', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', cat: 'Restaurante & Bar' as ProductCategory, type: 'restaurant' as const },
    { label: 'Loja de Roupas / Moda', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', cat: 'Loja de Roupas' as ProductCategory, type: 'pos' as const },
    { label: 'Supermercado Multi-Caixa', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', cat: 'Supermercado' as ProductCategory, type: 'pos' as const },
    { label: 'Stock & Armazém', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', cat: 'Gestão de Stock & Armazém' as ProductCategory, type: 'inventory' as const },
    { label: 'Comércio Eletrónico', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80', cat: 'Comércio Eletrónico' as ProductCategory, type: 'ecommerce' as const },
    { label: 'Sistemas Financeiros', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80', cat: 'Sistemas Financeiros' as ProductCategory, type: 'pos' as const },
  ];

  const hardwareOptions = [
    'Impressora Térmica 58/80mm',
    'Gaveta de Dinheiro RJ11',
    'Leitor Código de Barras 1D/2D',
    'Balança Digital de Peso',
    'Terminal POS Android Móvel (Sunmi)',
    'Teclado Programável de Caixa',
  ];

  const handleToggleHardware = (hw: string) => {
    setSelectedHardwares((prev) =>
      prev.includes(hw) ? prev.filter((item) => item !== hw) : [...prev, hw]
    );
  };

  const handleEditSystemClick = (sys: SystemProduct) => {
    setEditingSystemId(sys.id);
    setTitle(sys.title);
    setCategory(sys.category);
    setPrice(sys.price.toString());
    setDemoUrl(sys.demoUrl || '');
    setImageUrl(sys.imageUrl || '');
    setDescription(sys.description || '');
    setFeatures(sys.features.join('\n'));
    setDemoType(sys.demoType || 'pos');
    setOfflineSupported(sys.specs?.offlineMode ?? true);
    setMobileSupported(sys.isMobileSupported ?? true);
    setSelectedHardwares(sys.specs?.hardwareSupport || ['Impressora Térmica 58/80mm']);
    setBadgeText(sys.badges?.[0] || 'Atualizado');
    setActiveTab('new-system');
  };

  const handleSaveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) {
      alert('Por favor preencha os campos obrigatórios (Título, Preço e Descrição).');
      return;
    }

    const payload: SystemProduct = {
      id: editingSystemId || `tv-sys-${Date.now()}`,
      title: title.trim(),
      category,
      price: parseFloat(price) || 0,
      description: description.trim(),
      fullDescription: description.trim(),
      demoUrl: demoUrl.trim() || 'https://demo.techvisions.co.mz',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      likesCount: editingSystemId ? (systems.find((s) => s.id === editingSystemId)?.likesCount || 1) : 1,
      demoType,
      features: features.split('\n').filter((f) => f.trim().length > 0),
      badges: badgeText.trim() ? [badgeText.trim()] : ['Novo'],
      isMobileSupported: mobileSupported,
      isCloudSupported: true,
      specs: {
        platform: mobileSupported ? 'Android Mobile, Web, Windows' : 'Web, Windows POS',
        offlineMode: offlineSupported,
        hardwareSupport: selectedHardwares,
        languages: ['Português'],
      },
    };

    if (editingSystemId && onUpdateSystem) {
      onUpdateSystem(payload);
      alert(`O sistema "${title}" foi atualizado com sucesso!`);
    } else {
      onAddSystem(payload);
      alert(`O sistema "${title}" foi cadastrado com sucesso no catálogo TechVisions!`);
    }

    setEditingSystemId(null);
    setTitle('');
    setDescription('');
    setActiveTab('catalog');
  };

  // ==========================================
  // PARTNERS MANAGEMENT STATE & LOGIC
  // ==========================================
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<'telco' | 'banking' | 'hardware'>('telco');
  const [partnerCategoryLabel, setPartnerCategoryLabel] = useState('Carteira Móvel & Pagamentos');
  const [partnerLogo, setPartnerLogo] = useState('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=300&q=80');
  const [partnerDescription, setPartnerDescription] = useState('');
  const [partnerStatus, setPartnerStatus] = useState<'Oficial' | 'Homologado' | 'Certificado' | 'Ativo'>('Oficial');
  const [partnerLatency, setPartnerLatency] = useState('< 1.8 segundos');
  const [partnerProtocol, setPartnerProtocol] = useState('STK Push API REST v2');
  const [partnerUptime, setPartnerUptime] = useState('99.98%');
  const [partnerTechHighlight, setPartnerTechHighlight] = useState('Disparo instantâneo no telemóvel do cliente');
  const [partnerPrefixCoverage, setPartnerPrefixCoverage] = useState('Nacional (Moçambique)');
  const [partnerFeatures, setPartnerFeatures] = useState('STK Push em tempo real\nReconciliação diária de caixa\nValidação de PIN no telemóvel');

  const handleOpenNewPartnerModal = () => {
    setEditingPartnerId(null);
    setPartnerName('');
    setPartnerCategory('telco');
    setPartnerCategoryLabel('Carteira Móvel & Pagamentos');
    setPartnerLogo('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=300&q=80');
    setPartnerDescription('');
    setPartnerStatus('Oficial');
    setPartnerLatency('< 1.8s');
    setPartnerProtocol('REST API / STK Push');
    setPartnerUptime('99.98%');
    setPartnerTechHighlight('Notificação automática de pagamento');
    setPartnerPrefixCoverage('Todo Moçambique');
    setPartnerFeatures('Conexão direta\nSem necessidade de POS físico\nFecho automático');
    setIsPartnerModalOpen(true);
  };

  const handleEditPartnerClick = (p: PartnerIntegration) => {
    setEditingPartnerId(p.id);
    setPartnerName(p.name);
    setPartnerCategory(p.category);
    setPartnerCategoryLabel(p.categoryLabel);
    setPartnerLogo(p.logo);
    setPartnerDescription(p.description);
    setPartnerStatus(p.status);
    setPartnerLatency(p.latency || '< 2.0s');
    setPartnerProtocol(p.protocol || 'API Integrada');
    setPartnerUptime(p.uptime || '99.9%');
    setPartnerTechHighlight(p.techHighlight || '');
    setPartnerPrefixCoverage(p.prefixCoverage || 'Moçambique');
    setPartnerFeatures(p.features.join('\n'));
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerDescription.trim()) {
      alert('Preencha o nome e a descrição do parceiro.');
      return;
    }

    const payload: PartnerIntegration = {
      id: editingPartnerId || `partner-${Date.now()}`,
      name: partnerName.trim(),
      category: partnerCategory,
      categoryLabel: partnerCategoryLabel.trim(),
      logo: partnerLogo.trim(),
      description: partnerDescription.trim(),
      status: partnerStatus,
      latency: partnerLatency.trim(),
      protocol: partnerProtocol.trim(),
      uptime: partnerUptime.trim(),
      techHighlight: partnerTechHighlight.trim(),
      prefixCoverage: partnerPrefixCoverage.trim(),
      features: partnerFeatures.split('\n').filter((f) => f.trim().length > 0),
    };

    if (editingPartnerId && onUpdatePartner) {
      onUpdatePartner(payload);
      alert(`Parceiro "${partnerName}" atualizado com sucesso!`);
    } else if (onAddPartner) {
      onAddPartner(payload);
      alert(`Parceiro "${partnerName}" adicionado com sucesso ao ecossistema!`);
    }

    setIsPartnerModalOpen(false);
  };

  // ==========================================
  // NEWS & ARTICLES MANAGEMENT STATE & LOGIC
  // ==========================================
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Atualizações' | 'Hardware' | 'Fiscalidade' | 'Parcerias' | 'Dicas'>('Atualizações');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80');
  const [newsAuthor, setNewsAuthor] = useState('Equipa Técnica TechVisions');
  const [newsFeatured, setNewsFeatured] = useState(false);

  const handleOpenNewNewsModal = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsCategory('Atualizações');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80');
    setNewsAuthor('Equipa Técnica TechVisions');
    setNewsFeatured(false);
    setIsNewsModalOpen(true);
  };

  const handleEditNewsClick = (article: NewsArticle) => {
    setEditingNewsId(article.id);
    setNewsTitle(article.title);
    setNewsCategory(article.category);
    setNewsSummary(article.summary);
    setNewsContent(article.content);
    setNewsImage(article.imageUrl);
    setNewsAuthor(article.author);
    setNewsFeatured(article.isFeatured || false);
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) {
      alert('Preencha o título e o conteúdo do artigo.');
      return;
    }

    const payload: NewsArticle = {
      id: editingNewsId || `news-${Date.now()}`,
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim() || newsContent.slice(0, 140) + '...',
      content: newsContent.trim(),
      imageUrl: newsImage.trim(),
      date: new Date().toISOString().split('T')[0],
      readTime: '3 min de leitura',
      author: newsAuthor.trim() || 'TechVisions MZ',
      isFeatured: newsFeatured,
    };

    if (editingNewsId && onUpdateNews) {
      onUpdateNews(payload);
      alert(`Artigo "${newsTitle}" atualizado com sucesso!`);
    } else if (onAddNews) {
      onAddNews(payload);
      alert(`Artigo "${newsTitle}" publicado com sucesso!`);
    }

    setIsNewsModalOpen(false);
  };

  // ==========================================
  // MENUS & SUBMENUS MANAGEMENT STATE & LOGIC
  // ==========================================
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isSubmenuModalOpen, setIsSubmenuModalOpen] = useState(false);
  const [targetParentMenuId, setTargetParentMenuId] = useState<string | null>(null);

  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [menuLabel, setMenuLabel] = useState('');
  const [menuHref, setMenuHref] = useState('#catalog-section');
  const [menuBadge, setMenuBadge] = useState('');
  const [menuHighlight, setMenuHighlight] = useState(false);
  const [menuOrder, setMenuOrder] = useState<number>(1);

  // Submenu fields
  const [editingSubmenuId, setEditingSubmenuId] = useState<string | null>(null);
  const [submenuLabel, setSubmenuLabel] = useState('');
  const [submenuHref, setSubmenuHref] = useState('#catalog-section');
  const [submenuDesc, setSubmenuDesc] = useState('');
  const [submenuBadge, setSubmenuBadge] = useState('');
  const [submenuCategory, setSubmenuCategory] = useState<ProductCategory | 'Todas'>('Padaria');

  const handleOpenAddMenuModal = () => {
    setEditingMenuItemId(null);
    setMenuLabel('');
    setMenuHref('#catalog-section');
    setMenuBadge('');
    setMenuHighlight(false);
    setMenuOrder(menuItems.length + 1);
    setIsMenuModalOpen(true);
  };

  const handleEditMenuClick = (item: NavigationMenuItem) => {
    setEditingMenuItemId(item.id);
    setMenuLabel(item.label);
    setMenuHref(item.href);
    setMenuBadge(item.badge || '');
    setMenuHighlight(item.highlight || false);
    setMenuOrder(item.order);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuLabel.trim()) return;

    if (editingMenuItemId && onUpdateMenuItem) {
      const existing = menuItems.find((m) => m.id === editingMenuItemId);
      onUpdateMenuItem({
        ...existing,
        id: editingMenuItemId,
        label: menuLabel.trim(),
        href: menuHref.trim(),
        badge: menuBadge.trim() || undefined,
        highlight: menuHighlight,
        order: menuOrder,
        subItems: existing?.subItems || [],
      });
      alert(`Item de menu "${menuLabel}" atualizado!`);
    } else if (onAddMenuItem) {
      onAddMenuItem({
        id: `menu-${Date.now()}`,
        label: menuLabel.trim(),
        href: menuHref.trim(),
        badge: menuBadge.trim() || undefined,
        highlight: menuHighlight,
        order: menuOrder,
        subItems: [],
      });
      alert(`Novo item de menu "${menuLabel}" adicionado!`);
    }

    setIsMenuModalOpen(false);
  };

  const handleOpenAddSubmenuModal = (parentMenuId: string) => {
    setTargetParentMenuId(parentMenuId);
    setEditingSubmenuId(null);
    setSubmenuLabel('');
    setSubmenuHref('#catalog-section');
    setSubmenuDesc('');
    setSubmenuBadge('');
    setSubmenuCategory('Padaria');
    setIsSubmenuModalOpen(true);
  };

  const handleEditSubmenuClick = (parentMenuId: string, sub: NavigationSubItem) => {
    setTargetParentMenuId(parentMenuId);
    setEditingSubmenuId(sub.id);
    setSubmenuLabel(sub.label);
    setSubmenuHref(sub.href);
    setSubmenuDesc(sub.description || '');
    setSubmenuBadge(sub.badge || '');
    setSubmenuCategory(sub.categoryFilter || 'Padaria');
    setIsSubmenuModalOpen(true);
  };

  const handleSaveSubmenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParentMenuId || !submenuLabel.trim()) return;

    const parent = menuItems.find((m) => m.id === targetParentMenuId);
    if (!parent) return;

    const currentSubs = parent.subItems || [];
    let updatedSubs: NavigationSubItem[];

    if (editingSubmenuId) {
      updatedSubs = currentSubs.map((s) =>
        s.id === editingSubmenuId
          ? {
              ...s,
              label: submenuLabel.trim(),
              href: submenuHref.trim(),
              description: submenuDesc.trim() || undefined,
              badge: submenuBadge.trim() || undefined,
              categoryFilter: submenuCategory,
            }
          : s
      );
    } else {
      updatedSubs = [
        ...currentSubs,
        {
          id: `sub-${Date.now()}`,
          label: submenuLabel.trim(),
          href: submenuHref.trim(),
          description: submenuDesc.trim() || undefined,
          badge: submenuBadge.trim() || undefined,
          categoryFilter: submenuCategory,
        },
      ];
    }

    if (onUpdateMenuItem) {
      onUpdateMenuItem({
        ...parent,
        subItems: updatedSubs,
      });
      alert(`Submenu "${submenuLabel}" gravado com sucesso!`);
    }

    setIsSubmenuModalOpen(false);
  };

  const handleDeleteSubmenu = (parentMenuId: string, subId: string) => {
    if (!confirm('Deseja remover este submenu?')) return;
    const parent = menuItems.find((m) => m.id === parentMenuId);
    if (!parent || !onUpdateMenuItem) return;

    onUpdateMenuItem({
      ...parent,
      subItems: (parent.subItems || []).filter((s) => s.id !== subId),
    });
  };

  // ==========================================
  // SLIDER HERO & KINETIC TYPOGRAPHY MANAGEMENT
  // ==========================================
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideBadge, setSlideBadge] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideHighlightWord, setSlideHighlightWord] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slidePrimaryCtaText, setSlidePrimaryCtaText] = useState('Explorar Softwares');
  const [slidePrimaryCtaLink, setSlidePrimaryCtaLink] = useState('#catalog-section');
  const [slideSecondaryCtaText, setSlideSecondaryCtaText] = useState('Ver Parceiros Oficiais');
  const [slideSecondaryCtaLink, setSlideSecondaryCtaLink] = useState('#parceiros-section');
  const [slideImageUrl, setSlideImageUrl] = useState('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80');
  const [slideGradientPreset, setSlideGradientPreset] = useState<'blue' | 'purple' | 'emerald' | 'sunset'>('blue');
  const [slideIsActive, setSlideIsActive] = useState(true);
  const [slideOrder, setSlideOrder] = useState(1);
  const [slidePill1, setSlidePill1] = useState('M-Pesa & E-Mola Integrados');
  const [slidePill2, setSlidePill2] = useState('100% Funcional Offline');
  const [slidePill3, setSlidePill3] = useState('Licença Vitalícia com Suporte Local');

  // Preview test key to re-trigger kinetic letters in preview modal
  const [previewAnimKey, setPreviewAnimKey] = useState(0);

  const handleOpenAddSlideModal = () => {
    setEditingSlideId(null);
    setSlideBadge('Tecnologia POS Avançada 2026 • Moçambique');
    setSlideTitle('Sistemas de Faturação Rápida e');
    setSlideHighlightWord('Gestão Comercial Completa');
    setSlideSubtitle('Fature com alta velocidade, controle fiado no balcão e emita talões térmicos com corte automático mesmo sem eletricidade.');
    setSlidePrimaryCtaText('Testar Demonstrações');
    setSlidePrimaryCtaLink('#catalog-section');
    setSlideSecondaryCtaText('Consultar Revendedores');
    setSlideSecondaryCtaLink('#maps-advisor');
    setSlideImageUrl('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80');
    setSlideGradientPreset('blue');
    setSlideIsActive(true);
    setSlideOrder(slides.length + 1);
    setSlidePill1('M-Pesa & E-Mola Integrados');
    setSlidePill2('100% Funcional Offline');
    setSlidePill3('Impressoras Térmicas 58/80mm');
    setPreviewAnimKey((k) => k + 1);
    setIsSlideModalOpen(true);
  };

  const handleEditSlideClick = (sl: HeroSlide) => {
    setEditingSlideId(sl.id);
    setSlideBadge(sl.badge);
    setSlideTitle(sl.title);
    setSlideHighlightWord(sl.highlightWord);
    setSlideSubtitle(sl.subtitle);
    setSlidePrimaryCtaText(sl.primaryCtaText);
    setSlidePrimaryCtaLink(sl.primaryCtaLink);
    setSlideSecondaryCtaText(sl.secondaryCtaText);
    setSlideSecondaryCtaLink(sl.secondaryCtaLink);
    setSlideImageUrl(sl.imageUrl || '');
    setSlideIsActive(sl.isActive);
    setSlideOrder(sl.order);
    setSlidePill1(sl.statsPills?.[0]?.text || '');
    setSlidePill2(sl.statsPills?.[1]?.text || '');
    setSlidePill3(sl.statsPills?.[2]?.text || '');
    setPreviewAnimKey((k) => k + 1);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideHighlightWord.trim()) {
      alert('Preencha o título e a palavra destacada animada do slide.');
      return;
    }

    let gradientFrom = 'from-slate-950';
    let gradientVia = 'via-blue-950';
    let gradientTo = 'to-slate-900';
    let accentColor = 'from-blue-400 via-sky-300 to-emerald-400';

    if (slideGradientPreset === 'purple') {
      gradientVia = 'via-purple-950';
      accentColor = 'from-purple-400 via-pink-300 to-amber-300';
    } else if (slideGradientPreset === 'emerald') {
      gradientVia = 'via-emerald-950';
      accentColor = 'from-emerald-400 via-teal-300 to-cyan-300';
    } else if (slideGradientPreset === 'sunset') {
      gradientVia = 'via-red-950';
      accentColor = 'from-amber-400 via-orange-300 to-rose-400';
    }

    const pills = [
      slidePill1 && { id: 'p-1', icon: 'Smartphone', text: slidePill1.trim() },
      slidePill2 && { id: 'p-2', icon: 'WifiOff', text: slidePill2.trim() },
      slidePill3 && { id: 'p-3', icon: 'ShieldCheck', text: slidePill3.trim() },
    ].filter(Boolean) as any[];

    const payload: HeroSlide = {
      id: editingSlideId || `slide-${Date.now()}`,
      badge: slideBadge.trim() || 'TechVisions Moçambique',
      title: slideTitle.trim(),
      highlightWord: slideHighlightWord.trim(),
      subtitle: slideSubtitle.trim(),
      primaryCtaText: slidePrimaryCtaText.trim() || 'Ver Catálogo',
      primaryCtaLink: slidePrimaryCtaLink.trim() || '#catalog-section',
      secondaryCtaText: slideSecondaryCtaText.trim() || 'Parceiros',
      secondaryCtaLink: slideSecondaryCtaLink.trim() || '#parceiros-section',
      imageUrl: slideImageUrl.trim(),
      gradientFrom,
      gradientVia,
      gradientTo,
      accentColor,
      statsPills: pills,
      isActive: slideIsActive,
      order: slideOrder,
    };

    if (editingSlideId && onUpdateSlide) {
      onUpdateSlide(payload);
      alert(`Slide atualizado com sucesso!`);
    } else if (onAddSlide) {
      onAddSlide(payload);
      alert(`Novo slide animado adicionado ao banner principal!`);
    }

    setIsSlideModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
              Painel de Administração TechVisions
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Administrador Master
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gestão Comercial, Financeira &amp; Ecossistema
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl">
            Supervisione relatórios financeiros completos, vendas por M-Pesa e E-Mola, cadastre novos softwares, modere comentários, gira os parceiros, novidades, menus de navegação e banners com animação cinética de letras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportToGoogleSheets}
            disabled={isExportingSheets}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            {isExportingSheets ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Exportar para Google Sheets</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Descarregar ficheiro CSV para Excel"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
          >
            Voltar ao Catálogo
          </button>
        </div>
      </div>

      {sheetNotification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sheetNotification}</span>
          </div>
          {exportedSheetUrl && (
            <a
              href={exportedSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
            >
              <span>Abrir Planilha no Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'financials'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Relatórios Financeiros</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Catálogo de Sistemas ({systems.length})</span>
        </button>

        <button
          onClick={() => {
            setEditingSystemId(null);
            setTitle('');
            setDescription('');
            setActiveTab('new-system');
          }}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'new-system'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{editingSystemId ? 'Editar Sistema' : 'Cadastrar Novo Sistema'}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-blue-600" />
          <span>Categorias de Produtos ({effectiveCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Serviços Oferecidos ({effectiveServices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'partners'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-indigo-600" />
          <span>Parceiros &amp; Redes ({partners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'news'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-purple-600" />
          <span>Novidades &amp; Artigos ({news.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'comments'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
          <span>Comentários ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menus')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'menus'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Menu className="w-3.5 h-3.5 text-sky-600" />
          <span>Menus &amp; Submenus ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slider')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'slider'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-rose-600" />
          <span>Slider Hero &amp; Letras ({slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Vendas &amp; Contratos ({effectiveOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-emerald-600" />
          <span>Configurações &amp; APIs</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-indigo-600" />
          <span>Configurações SEO</span>
        </button>
      </div>

      {/* Tab 1: Financial Reports */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Receita Bruta</span>
                <p className="text-2xl font-black text-emerald-700">{formatMZN(grossRevenue)}</p>
                <span className="text-[10px] text-gray-400">Total transacionado</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Receita Líquida Estimada</span>
                <p className="text-2xl font-black text-blue-900">{formatMZN(netRevenue)}</p>
                <span className="text-[10px] text-gray-400">Pós-taxas de carteira móvel</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Ticket Médio por Licença</span>
                <p className="text-2xl font-black text-purple-800">{formatMZN(averageTicket)}</p>
                <span className="text-[10px] text-gray-400">Média por cliente</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium">Previsão IVA (16% AT)</span>
                <p className="text-2xl font-black text-amber-800">{formatMZN(vatEstimate)}</p>
                <span className="text-[10px] text-gray-400">Regime tributário MZ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Repartição Financeira por Canal de Pagamento
                  </h3>
                  <p className="text-xs text-gray-500">
                    Volume em Meticais e percentagem de cada canal em Moçambique
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  100% Auditável
                </span>
              </div>

              <div className="space-y-5 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      Vodacom M-Pesa (Prefixos 84/85)
                    </span>
                    <span className="font-bold text-emerald-700">
                      {formatMZN(mpesaTotal)} ({grossRevenue > 0 ? ((mpesaTotal / grossRevenue) * 100).toFixed(0) : 0}%) • {mpesaCount} transações
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${grossRevenue > 0 ? (mpesaTotal / grossRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      Movitel E-Mola (Prefixos 86/87)
                    </span>
                    <span className="font-bold text-amber-700">
                      {formatMZN(emolaTotal)} ({grossRevenue > 0 ? ((emolaTotal / grossRevenue) * 100).toFixed(0) : 0}%) • {emolaCount} transações
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${grossRevenue > 0 ? (emolaTotal / grossRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Cartões Bancários &amp; SIMO Rede (BIM / BCI)
                    </span>
                    <span className="font-bold text-blue-700">
                      {formatMZN(visaTotal)} ({grossRevenue > 0 ? ((visaTotal / grossRevenue) * 100).toFixed(0) : 0}%) • {visaCount} transações
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${grossRevenue > 0 ? (visaTotal / grossRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Exportações &amp; Auditoria Fiscal
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Sincronização com o Google Drive e folha de cálculo Google Sheets para a sua contabilidade em Moçambique.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-start gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Google Sheets Conectado</span>
                      <span className="text-[11px] text-emerald-700">Gera relatórios automáticos no Drive da empresa</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 flex items-start gap-2.5">
                    <Tag className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Regime Simplificado &amp; Geral</span>
                      <span className="text-[11px] text-blue-700">Linhas preparadas para modelo 10 e mapas de IVA</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleExportToGoogleSheets}
                disabled={isExportingSheets}
                className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                {isExportingSheets ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <span>Gerar Folha no Google Sheets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog of Systems */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Todos os Softwares Cadastrados ({systems.length})
              </h3>
              <p className="text-xs text-gray-500">
                Faça a gestão completa de preços, funcionalidades e modo offline de cada sistema comercial.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSystemId(null);
                setTitle('');
                setDescription('');
                setActiveTab('new-system');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Sistema</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Sistema</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Preço (MZN)</th>
                  <th className="p-4">Offline &amp; Mobile</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {systems.map((sys) => (
                  <tr key={sys.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={sys.imageUrl}
                        alt={sys.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">{sys.title}</span>
                        <span className="text-[11px] text-gray-400 line-clamp-1">{sys.description}</span>
                        {sys.badges && sys.badges.length > 0 && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                            {sys.badges[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {sys.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900 text-sm">{formatMZN(sys.price)}</td>
                    <td className="p-4">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {sys.specs?.offlineMode ? '100% Offline' : 'Web Online'}
                        </span>
                        <span className="text-gray-400 block">
                          {sys.isMobileSupported ? 'Android & POS' : 'Windows PC'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditSystemClick(sys)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar sistema"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Tem a certeza que deseja eliminar o sistema "${sys.title}"?`)) {
                              onDeleteSystem(sys.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar sistema"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Registration / Edit Form */}
      {activeTab === 'new-system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>{editingSystemId ? 'Editar Software Comercial' : 'Registo Completo de Novo Software / POS'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Defina as características comerciais, modo offline, hardware homologado e publique instantaneamente no catálogo público.
            </p>

            <form onSubmit={handleSaveSystem} className="space-y-5 text-xs">
              {/* Presets Rápidos */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  Presets Rápidos de Sector Moçambicano:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {imagePresets.map((pr) => (
                    <button
                      key={pr.label}
                      type="button"
                      onClick={() => {
                        setImageUrl(pr.url);
                        setCategory(pr.cat);
                        setDemoType(pr.type);
                        if (!title || title.startsWith('TechVisions -')) setTitle(`TechVisions - ${pr.label}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 text-[11px] font-medium border border-gray-200 transition"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Título do Sistema *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TechPadaria Pro - Gestão & Ponto de Venda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 block">Categoria de Negócio *</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                    >
                      + Gerir Categorias
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                  >
                    {effectiveCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.icon ? `${c.icon} ` : ''}{c.name} {c.badge ? `(${c.badge})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Preço da Licença (MZN) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    placeholder="18500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Emblema de Destaque</label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Vendido, Novo, 100% Offline"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">URL da Imagem de Capa</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descrição Comercial Resumida *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva para quem é o sistema e os principais benefícios no dia a dia da loja..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Funcionalidades Principais (Uma por linha)
                </label>
                <textarea
                  rows={4}
                  placeholder="Modo 100% Offline com sincronização&#10;Emissão rápida de faturas e talões&#10;Integração direta com M-Pesa e E-Mola"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed font-mono"
                />
              </div>

              {/* Hardware & Offline Toggles */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
                <span className="font-bold text-gray-900 block text-xs">
                  Especificações de Hardware &amp; Redes (Moçambique)
                </span>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offlineSupported}
                      onChange={(e) => setOfflineSupported(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-700">Opera 100% Offline (Sem Internet)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mobileSupported}
                      onChange={(e) => setMobileSupported(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-700">Compatível com Android / Sunmi Móvel</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1.5">
                    Hardware Homologado:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hardwareOptions.map((hw) => (
                      <label key={hw} className="flex items-center gap-1.5 text-[11px] text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedHardwares.includes(hw)}
                          onChange={() => handleToggleHardware(hw)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{hw}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSystemId ? 'Atualizar Sistema' : 'Publicar Sistema no Catálogo'}</span>
                </button>

                {editingSystemId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSystemId(null);
                      setTitle('');
                      setDescription('');
                      setActiveTab('catalog');
                    }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Live Card Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Pré-visualização do Cartão Comercial
            </h3>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
              <div className="relative h-44 bg-slate-200">
                <img
                  src={imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-900/80 backdrop-blur text-white text-[11px] font-bold">
                    {category}
                  </span>
                  {badgeText && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      {badgeText}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-gray-900 text-sm">{title || 'Título do Software'}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {description || 'Descrição do sistema para os comerciantes moçambicanos...'}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Preço de Licença</span>
                    <span className="text-sm font-black text-blue-900">{formatMZN(parseFloat(price) || 0)}</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                    Demo Pronta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Categories Management */}
      {activeTab === 'categories' && onAddCategory && onUpdateCategory && onDeleteCategory && (
        <AdminCategoriesSection
          categories={effectiveCategories}
          systems={systems}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
          onNavigateToNewSystem={(catName) => {
            setCategory(catName);
            setActiveTab('new-system');
          }}
        />
      )}

      {/* Tab 4: Partners Management */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>Gestão de Parceiros Oficiais &amp; Redes ({partners.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Adicione e configure novas operadoras móveis, gateways bancários SIMO e fabricantes de hardware fiscal.
              </p>
            </div>
            <button
              onClick={handleOpenNewPartnerModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adicionar Novo Parceiro</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {partners.map((partner) => (
              <div key={partner.id} className="p-5 rounded-2xl border border-gray-200 bg-slate-50 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 text-sm">{partner.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {partner.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold block mb-2">{partner.categoryLabel}</span>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{partner.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Latência:</span>
                      <span className="font-semibold text-gray-800">{partner.latency || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Uptime:</span>
                      <span className="font-semibold text-emerald-600">{partner.uptime || '99.9%'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEditPartnerClick(partner)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {onDeletePartner && (
                      <button
                        onClick={() => {
                          if (confirm(`Eliminar o parceiro "${partner.name}"?`)) {
                            onDeletePartner(partner.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar parceiro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: News & Articles Management */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-600" />
                <span>Gestão de Notícias &amp; Novidades ({news.length})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Publique avisos sobre atualizações de software, homologações fiscais e novidades para clientes.
              </p>
            </div>
            <button
              onClick={handleOpenNewNewsModal}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Nova Notícia</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {news.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {item.category}
                    </span>
                    <span className="text-gray-400 text-[10px]">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{item.title}</h4>
                  <p className="text-gray-500 line-clamp-3 mb-4 leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{item.author}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditNewsClick(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {onDeleteNews && (
                      <button
                        onClick={() => {
                          if (confirm(`Eliminar a notícia "${item.title}"?`)) {
                            onDeleteNews(item.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar notícia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Comments & Testimonials Moderation */}
      {activeTab === 'comments' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Moderação de Testemunhos &amp; Avaliações de Clientes
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Aprove, oculte ou edite os comentários de comerciantes moçambicanos no site.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {comments.length} Avaliações Registadas
            </span>
          </div>

          <div className="space-y-4">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-2xl border border-gray-200 bg-slate-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{comm.userName}</span>
                    <span className="text-gray-500 font-medium">({comm.userCompany} • {comm.city})</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= comm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 italic">"{comm.comment}"</p>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span>Sistema: <strong>{comm.systemTitle}</strong></span>
                    <span>•</span>
                    <span>Data: {comm.date}</span>
                    {comm.isApproved && (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Aprovado no Site
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onToggleCommentApproval && (
                    <button
                      onClick={() => onToggleCommentApproval(comm.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${
                        comm.isApproved
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {comm.isApproved ? 'Ocultar' : 'Aprovar'}
                    </button>
                  )}

                  {onDeleteComment && (
                    <button
                      onClick={() => {
                        if (confirm('Deseja eliminar este comentário?')) {
                          onDeleteComment(comm.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition"
                      title="Eliminar comentário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Menus & Submenus Management */}
      {activeTab === 'menus' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Menu className="w-5 h-5 text-sky-600" />
                <span>Configuração de Menus e Submenus de Navegação</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Adicione novos links no cabeçalho principal, crie submenus de produtos e organize a ordem de visualização.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onResetMenuItems && (
                <button
                  onClick={() => {
                    if (confirm('Restaurar configuração de menus original?')) {
                      onResetMenuItems();
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              )}

              <button
                onClick={handleOpenAddMenuModal}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar Menu Principal</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {menuItems
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-slate-50/70 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                        {item.order}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">{item.label}</h3>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                          {item.highlight && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Destaque
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 font-mono text-[11px]">{item.href}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddSubmenuModal(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold transition flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Adicionar Submenu</span>
                      </button>

                      <button
                        onClick={() => handleEditMenuClick(item)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                        title="Editar menu"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {onDeleteMenuItem && (
                        <button
                          onClick={() => {
                            if (confirm(`Remover menu "${item.label}"?`)) {
                              onDeleteMenuItem(item.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition"
                          title="Eliminar menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submenus List */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="pl-4 sm:pl-10 pt-2 border-t border-gray-200/80 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Submenus ({item.subItems.length})
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.subItems.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl bg-white border border-gray-200/90 flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-800">{sub.label}</span>
                                {sub.badge && (
                                  <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-gray-400 text-[11px] line-clamp-1">{sub.description}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleEditSubmenuClick(item.id, sub)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 transition"
                                title="Editar submenu"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubmenu(item.id, sub.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition"
                                title="Eliminar submenu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 8: Slider Hero & Kinetic Typography Management */}
      {activeTab === 'slider' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-600" />
                <span>Gestão do Slider Hero &amp; Animação de Letras Cinéticas</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Personalize os slides rotativos da página principal, configure títulos, destaques com gradientes cintilantes e botões de ação.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onResetSlides && (
                <button
                  onClick={() => {
                    if (confirm('Restaurar slides padrão com animações de letras?')) {
                      onResetSlides();
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Slides</span>
                </button>
              )}

              <button
                onClick={handleOpenAddSlideModal}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Adicionar Novo Slide</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {slides
              .sort((a, b) => a.order - b.order)
              .map((sl) => (
                <div
                  key={sl.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-slate-900 text-white shadow-md flex flex-col justify-between overflow-hidden relative group"
                >
                  {/* Background preview */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                        Slide {sl.order} • {sl.isActive ? 'Ativo' : 'Oculto'}
                      </span>
                      {onUpdateSlide && (
                        <button
                          onClick={() => onUpdateSlide({ ...sl, isActive: !sl.isActive })}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sl.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {sl.isActive ? 'Em Exibição' : 'Pausado'}
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-blue-200 font-medium">{sl.badge}</p>

                    <div>
                      <h4 className="font-bold text-white text-sm">{sl.title}</h4>
                      <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300 text-sm block">
                        {sl.highlightWord}
                      </span>
                    </div>

                    <p className="text-blue-100/70 text-[11px] line-clamp-2 leading-relaxed">
                      {sl.subtitle}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                        {sl.primaryCtaText}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold text-[10px]">
                        {sl.secondaryCtaText}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                    <span className="text-[10px] text-white/50">{sl.statsPills?.length || 0} Badges</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditSlideClick(sl)}
                        className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition flex items-center gap-1 text-[11px]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {onDeleteSlide && (
                        <button
                          onClick={() => {
                            if (confirm('Eliminar este slide do banner principal?')) {
                              onDeleteSlide(sl.id);
                            }
                          }}
                          className="p-1.5 text-white/50 hover:text-rose-400 hover:bg-white/10 rounded-lg transition"
                          title="Eliminar slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 9: Orders & Contracts */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">
                  Exportação de Resumo de Vendas e Contratos (Google Sheets API)
                </h3>
              </div>
              <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                Gera uma planilha organizada com abas automáticas: <strong>Resumo_Vendas</strong> (pedidos, clientes, M-Pesa, E-Mola, Visa e montantes em MZN) e <strong>Contratos_Licencas</strong> (chaves de licença vitalícia e registos de entrega de software).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleExportToGoogleSheets}
                disabled={isExportingSheets}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                {isExportingSheets ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <span>Gerar Planilha Google Sheets</span>
              </button>

              {exportedSheetUrl && (
                <a
                  href={exportedSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Abrir Planilha</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {effectiveOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl border border-gray-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{ord.orderNumber}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {ord.paymentStatus}
                    </span>
                    <span className="text-gray-400">({new Date(ord.createdAt).toLocaleString('pt-MZ')})</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Cliente: <strong className="text-gray-800">{ord.userName}</strong> • {ord.userPhone} • {ord.userEmail}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Método: <strong className="text-blue-800">{ord.paymentMethod}</strong> (Ref: {ord.transactionRef})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ord.items.map((i, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border text-[11px] text-gray-700">
                        {i.title} • Licença: <code className="font-mono text-blue-600">{i.licenseKey}</code>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-gray-400 block">Total Pago:</span>
                  <span className="text-base font-black text-blue-900">{formatMZN(ord.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: System Settings & APIs */}
      {activeTab === 'settings' && companySettings && onUpdateCompanySettings && apiConfig && onUpdateApiConfig && (
        <AdminSettingsSection
          companySettings={companySettings}
          onUpdateCompanySettings={onUpdateCompanySettings}
          apiConfig={apiConfig}
          onUpdateApiConfig={onUpdateApiConfig}
        />
      )}

      {/* Tab: SEO Configurations */}
      {activeTab === 'seo' && onUpdateSeoSettings && (
        <AdminSeoSection
          seoSettings={seoSettings || INITIAL_SEO_SETTINGS}
          onUpdateSeoSettings={onUpdateSeoSettings}
        />
      )}

      {/* Tab: Services Management */}
      {activeTab === 'services' && onAddService && onUpdateService && onDeleteService && (
        <AdminServicesSection
          services={effectiveServices}
          onAddService={onAddService}
          onUpdateService={onUpdateService}
          onDeleteService={onDeleteService}
          onResetServices={onResetServices}
        />
      )}

      {/* ========================================================
          MODALS: PARTNER, NEWS, MENU, SUBMENU, SLIDER
      ======================================================== */}

      {/* PARTNER MODAL */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>{editingPartnerId ? 'Editar Parceiro Oficial' : 'Adicionar Novo Parceiro'}</span>
              </h3>
              <button onClick={() => setIsPartnerModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome da Entidade / Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Standard Bank Moçambique ou Sunmi POS"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Categoria</label>
                  <select
                    value={partnerCategory}
                    onChange={(e) => setPartnerCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="telco">Telecom / Carteira Móvel</option>
                    <option value="banking">Rede Bancária / SIMO</option>
                    <option value="hardware">Hardware / Equipamentos POS</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Rótulo da Categoria</label>
                  <input
                    type="text"
                    value={partnerCategoryLabel}
                    onChange={(e) => setPartnerCategoryLabel(e.target.value)}
                    placeholder="Ex: Carteira Móvel & Pagamentos"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descrição Comercial &amp; Técnica *</label>
                <textarea
                  rows={3}
                  required
                  value={partnerDescription}
                  onChange={(e) => setPartnerDescription(e.target.value)}
                  placeholder="Descreva a integração com o ponto de venda e a segurança para comerciantes..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Estado</label>
                  <select
                    value={partnerStatus}
                    onChange={(e) => setPartnerStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Oficial">Oficial</option>
                    <option value="Homologado">Homologado</option>
                    <option value="Certificado">Certificado</option>
                    <option value="Ativo">Ativo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Latência</label>
                  <input
                    type="text"
                    value={partnerLatency}
                    onChange={(e) => setPartnerLatency(e.target.value)}
                    placeholder="< 1.8s"
                    className="w-full px-2 py-1.5 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Uptime</label>
                  <input
                    type="text"
                    value={partnerUptime}
                    onChange={(e) => setPartnerUptime(e.target.value)}
                    placeholder="99.98%"
                    className="w-full px-2 py-1.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Recursos Oferecidos (Um por linha)</label>
                <textarea
                  rows={3}
                  value={partnerFeatures}
                  onChange={(e) => setPartnerFeatures(e.target.value)}
                  placeholder="STK Push em tempo real&#10;Reconciliação diária de caixa"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Gravar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEWS MODAL */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-purple-600" />
                <span>{editingNewsId ? 'Editar Artigo de Novidade' : 'Publicar Nova Notícia'}</span>
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Título do Artigo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atualização 2.7: Nova integração com balanças digitais"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Categoria</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="Atualizações">Atualizações</option>
                    <option value="Hardware">Hardware POS</option>
                    <option value="Fiscalidade">Fiscalidade / IVA</option>
                    <option value="Parcerias">Parcerias</option>
                    <option value="Dicas">Dicas de Gestão</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Autor</label>
                  <input
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    placeholder="Equipa TechVisions"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Resumo Breve</label>
                <input
                  type="text"
                  placeholder="Uma frase para o cartão..."
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Conteúdo Completo *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Descreva as instruções, novos recursos e vantagens para o lojista..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsFeatured}
                  onChange={(e) => setNewsFeatured(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-bold text-gray-700">Destacar no topo da secção de novidades</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  Gravar Notícia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENU MODAL */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Menu className="w-4 h-4 text-sky-600" />
                <span>{editingMenuItemId ? 'Editar Item de Menu' : 'Novo Item no Cabeçalho'}</span>
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Etiqueta do Menu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sistemas, Soluções, Preçário, FAQ"
                  value={menuLabel}
                  onChange={(e) => setMenuLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Destino do Link (Href / Âncora)</label>
                <input
                  type="text"
                  placeholder="#catalog-section ou #parceiros-section ou #maps-advisor"
                  value={menuHref}
                  onChange={(e) => setMenuHref(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Pode usar âncoras locais: #catalog-section, #novidades-section, #testemunhos-section, #parceiros-section ou #maps-advisor
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Emblema Opcional</label>
                  <input
                    type="text"
                    placeholder="Ex: Novo, Hot, MZ"
                    value={menuBadge}
                    onChange={(e) => setMenuBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    min="1"
                    value={menuOrder}
                    onChange={(e) => setMenuOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={menuHighlight}
                  onChange={(e) => setMenuHighlight(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="font-bold text-gray-700">Destaque visual (Estilo Esmeralda)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                >
                  Gravar Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMENU MODAL */}
      {isSubmenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>{editingSubmenuId ? 'Editar Submenu' : 'Adicionar Novo Submenu'}</span>
              </h3>
              <button onClick={() => setIsSubmenuModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmenu} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome do Submenu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Padaria & Pastelaria"
                  value={submenuLabel}
                  onChange={(e) => setSubmenuLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Filtrar Categoria do Catálogo</label>
                <select
                  value={submenuCategory}
                  onChange={(e) => setSubmenuCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="Padaria">Padaria</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Restaurante & Bar">Restaurante &amp; Bar</option>
                  <option value="Ferragens">Ferragens</option>
                  <option value="Supermercado">Supermercado</option>
                  <option value="Loja de Roupas">Loja de Roupas</option>
                  <option value="Gestão de Stock & Armazém">Gestão de Stock &amp; Armazém</option>
                  <option value="Venda de Serviços">Venda de Serviços</option>
                  <option value="Comércio Eletrónico">Comércio Eletrónico</option>
                  <option value="Sistemas Financeiros">Sistemas Financeiros</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descrição Curta</label>
                <input
                  type="text"
                  placeholder="Ex: Gestão de fornadas e balcão"
                  value={submenuDesc}
                  onChange={(e) => setSubmenuDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Emblema Opcional</label>
                <input
                  type="text"
                  placeholder="Ex: Popular, Mais Vendido"
                  value={submenuBadge}
                  onChange={(e) => setSubmenuBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubmenuModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                >
                  Gravar Submenu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDE HERO & KINETIC TYPOGRAPHY MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-5 text-xs my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-rose-500" />
                <span>{editingSlideId ? 'Editar Slide & Animação Cinética' : 'Configurar Novo Slide Hero'}</span>
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="font-bold text-blue-300 block mb-1">Texto da Insígnia Superior (Badge)</label>
                <input
                  type="text"
                  value={slideBadge}
                  onChange={(e) => setSlideBadge(e.target.value)}
                  placeholder="Ex: Soluções Certificadas para Moçambique • M-Pesa & E-Mola"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-blue-300 block mb-1">Título Inicial (Letras Animadas) *</label>
                  <input
                    type="text"
                    required
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="Ex: Sistemas Web & Mobile para o seu"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-amber-300 block mb-1">Palavra / Frase Destacada (Gradiente Cintilante) *</label>
                  <input
                    type="text"
                    required
                    value={slideHighlightWord}
                    onChange={(e) => setSlideHighlightWord(e.target.value)}
                    placeholder="Ex: Comércio em Moçambique"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-blue-300 block mb-1">Subtítulo / Descrição</label>
                <textarea
                  rows={2}
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  placeholder="Descreva as soluções comerciais de forma persuasiva para lojistas..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-blue-300 block mb-1">Botão Principal (Texto &amp; Link)</label>
                  <input
                    type="text"
                    value={slidePrimaryCtaText}
                    onChange={(e) => setSlidePrimaryCtaText(e.target.value)}
                    placeholder="Explorar Catálogo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={slidePrimaryCtaLink}
                    onChange={(e) => setSlidePrimaryCtaLink(e.target.value)}
                    placeholder="#catalog-section"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-bold text-blue-300 block mb-1">Botão Secundário (Texto &amp; Link)</label>
                  <input
                    type="text"
                    value={slideSecondaryCtaText}
                    onChange={(e) => setSlideSecondaryCtaText(e.target.value)}
                    placeholder="Ver Parceiros"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={slideSecondaryCtaLink}
                    onChange={(e) => setSlideSecondaryCtaLink(e.target.value)}
                    placeholder="#parceiros-section"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-blue-300 block mb-1">Tema Visual de Cor</label>
                  <select
                    value={slideGradientPreset}
                    onChange={(e) => setSlideGradientPreset(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="blue">Azul &amp; Esmeralda (Tecnologia &amp; M-Pesa)</option>
                    <option value="purple">Púrpura &amp; Rosa (Inovação POS)</option>
                    <option value="emerald">Verde Esmeralda (Finanças &amp; SIMO)</option>
                    <option value="sunset">Sunset Âmbar &amp; Dourado (Comércio)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-blue-300 block mb-1">Ordem no Slider</label>
                  <input
                    type="number"
                    min="1"
                    value={slideOrder}
                    onChange={(e) => setSlideOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* 3 Pills badges */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-blue-300 block text-[11px]">
                  Emblemas Flutuantes de Confiança (Pills)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={slidePill1}
                    onChange={(e) => setSlidePill1(e.target.value)}
                    placeholder="Pill 1 (ex: M-Pesa)"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                  />
                  <input
                    type="text"
                    value={slidePill2}
                    onChange={(e) => setSlidePill2(e.target.value)}
                    placeholder="Pill 2 (ex: 100% Offline)"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                  />
                  <input
                    type="text"
                    value={slidePill3}
                    onChange={(e) => setSlidePill3(e.target.value)}
                    placeholder="Pill 3 (ex: Suporte Maputo)"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                  />
                </div>
              </div>

              {/* Live Kinetic Typography Preview box */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400">
                    Pré-visualização da Animação Cinética de Letras
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewAnimKey((k) => k + 1)}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Reanimar Letras</span>
                  </button>
                </div>

                <div key={previewAnimKey} className="py-2">
                  <span className="text-sm font-bold text-white block">
                    {slideTitle || 'Título de Exemplo'}
                  </span>
                  <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 animate-shimmer-text block">
                    {slideHighlightWord || 'Palavra Animada'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/40"
                >
                  Gravar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

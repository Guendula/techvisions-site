/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import {
  SystemProduct,
  ProductCategory,
  TestimonialComment,
  NewsArticle,
  PartnerIntegration,
  NavigationMenuItem,
  HeroSlide,
  CompanySettings,
  SystemApiConfig,
  CategoryItem,
  SeoSettings,
  CompanyServiceItem,
} from './types';
import { INITIAL_SYSTEMS } from './data/initialSystems';
import { INITIAL_PARTNERS, INITIAL_COMMENTS, INITIAL_NEWS } from './data/partnersAndContent';
import { INITIAL_NAV_ITEMS, INITIAL_HERO_SLIDES } from './data/initialNavAndSlides';
import { INITIAL_COMPANY_SETTINGS, INITIAL_API_CONFIG } from './data/initialSettings';
import { INITIAL_CATEGORIES } from './data/initialCategories';
import { INITIAL_SEO_SETTINGS } from './data/initialSeo';
import { INITIAL_SERVICES } from './data/initialServices';
import { reassignCategory } from './utils/categories';
import { applySeoToDom } from './utils/seo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { SystemCard } from './components/SystemCard';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { MapsAdvisorModal } from './components/MapsAdvisorModal';
import { ComparatorFloatingBar } from './components/ComparatorFloatingBar';
import { SystemsComparatorModal } from './components/SystemsComparatorModal';
import { PartnersSection } from './components/PartnersSection';
import { NewsSection } from './components/NewsSection';
import { canAddToComparison } from './utils/comparator';
import { Footer } from './components/Footer';
import {
  Sparkles,
  ShoppingBag,
  Store,
  Layers,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  GitCompare,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  // Systems State with localStorage
  const [systems, setSystems] = useState<SystemProduct[]>(() => {
    const saved = localStorage.getItem('tv_catalog_systems');
    const raw: SystemProduct[] = saved ? JSON.parse(saved) : INITIAL_SYSTEMS;
    return raw.map((sys) => {
      const initialMatch = INITIAL_SYSTEMS.find((init) => init.id === sys.id);
      return {
        ...sys,
        videoUrl: sys.videoUrl ?? initialMatch?.videoUrl,
        faqs: sys.faqs && sys.faqs.length > 0 ? sys.faqs : initialMatch?.faqs,
        imageUrl: sys.imageUrl?.includes('photo-1556742049-0a67c5574f73')
          ? 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80'
          : sys.imageUrl,
      };
    });
  });

  // Comments / Testimonials State with localStorage
  const [comments, setComments] = useState<TestimonialComment[]>(() => {
    const saved = localStorage.getItem('tv_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  // News & Updates State with localStorage
  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('tv_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  // Partners State with localStorage
  const [partners, setPartners] = useState<PartnerIntegration[]>(() => {
    const saved = localStorage.getItem('tv_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  // Navigation Menus & Submenus State with localStorage (Guarantees: 1: Início, 2: Serviços, 3: Sobre Nós, 4: Contacto)
  const [menuItems, setMenuItems] = useState<NavigationMenuItem[]>(() => {
    const saved = localStorage.getItem('tv_menu_items');
    const raw: NavigationMenuItem[] = saved ? JSON.parse(saved) : INITIAL_NAV_ITEMS;

    const hasInicio = raw.some((m) => m.label.toLowerCase().includes('início') || m.id === 'nav-inicio' || m.href === '#top');
    const hasServicos = raw.some((m) => m.label.toLowerCase().includes('serviço') || m.id === 'nav-servicos' || m.href === '#servicos-section');
    const hasSobreNos = raw.some((m) => m.label.toLowerCase().includes('sobre') || m.id === 'nav-sobre-nos' || m.href === '#sobre-nos-section');
    const hasContacto = raw.some((m) => m.label.toLowerCase().includes('contacto') || m.id === 'nav-contacto' || m.href === '#contacto-section');

    if (!hasInicio || !hasServicos || !hasSobreNos || !hasContacto) {
      return INITIAL_NAV_ITEMS;
    }

    return raw
      .filter((i) => i.id !== 'nav-consultor-maps' && i.href !== '#maps-advisor' && i.badge !== 'IA Maputo')
      .map((i) => (i.badge === 'M-Pesa & Bancos' ? { ...i, badge: undefined } : i))
      .sort((a, b) => a.order - b.order);
  });

  // Hero Animated Slides State with localStorage
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('tv_hero_slides');
    const raw: HeroSlide[] = saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    return raw.map((s, idx) => {
      const def = INITIAL_HERO_SLIDES[idx % INITIAL_HERO_SLIDES.length];
      const cleanImg =
        !s.imageUrl || s.imageUrl.includes('photo-1556742049-0a67c5574f73')
          ? def?.imageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85'
          : s.imageUrl;
      return {
        ...s,
        imageUrl: cleanImg,
        textAnimation: s.textAnimation || def?.textAnimation || 'kinetic',
        titleColor: s.titleColor || def?.titleColor || '#FFFFFF',
        highlightColor: s.highlightColor !== undefined ? s.highlightColor : def?.highlightColor || '#38BDF8',
        subtitleColor: s.subtitleColor || def?.subtitleColor || '#F1F5F9',
        badgeColor: s.badgeColor || def?.badgeColor || '#6EE7B7',
        secondaryCtaLink: s.secondaryCtaLink === '#testemunhos-section' ? '#contacto-section' : s.secondaryCtaLink,
        secondaryCtaText: s.secondaryCtaText === 'Ver Histórias de Sucesso' ? 'Falar com Especialistas' : s.secondaryCtaText,
      };
    });
  });

  // Company Identity Settings State with localStorage
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('tv_company_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_SETTINGS;
  });

  // System & Payment APIs Configuration with localStorage
  const [apiConfig, setApiConfig] = useState<SystemApiConfig>(() => {
    const saved = localStorage.getItem('tv_api_settings');
    return saved ? JSON.parse(saved) : INITIAL_API_CONFIG;
  });

  // Product Categories State with localStorage
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('tv_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [currentView, setCurrentView] = useState<'catalog' | 'user-dashboard' | 'admin-dashboard'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Todas'>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [demoSystem, setDemoSystem] = useState<SystemProduct | null>(null);
  const [isMapsAdvisorOpen, setIsMapsAdvisorOpen] = useState(false);

  // Systems Comparator State
  const [comparedSystemIds, setComparedSystemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_compared_systems');
    return saved ? JSON.parse(saved) : ['tv-sys-padaria', 'tv-sys-mercearia'];
  });
  const [isComparatorModalOpen, setIsComparatorModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  useEffect(() => {
    localStorage.setItem('tv_catalog_systems', JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem('tv_compared_systems', JSON.stringify(comparedSystemIds));
  }, [comparedSystemIds]);

  useEffect(() => {
    localStorage.setItem('tv_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('tv_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('tv_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('tv_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('tv_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('tv_company_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('tv_api_settings', JSON.stringify(apiConfig));
  }, [apiConfig]);

  useEffect(() => {
    localStorage.setItem('tv_categories', JSON.stringify(categories));
  }, [categories]);

  // SEO Metadata Settings with localStorage
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    const saved = localStorage.getItem('tv_seo_settings');
    return saved ? JSON.parse(saved) : INITIAL_SEO_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('tv_seo_settings', JSON.stringify(seoSettings));
    applySeoToDom(seoSettings);
  }, [seoSettings]);

  // Company Services State with localStorage
  const [services, setServices] = useState<CompanyServiceItem[]>(() => {
    const saved = localStorage.getItem('tv_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem('tv_services', JSON.stringify(services));
  }, [services]);

  const handleToggleCompare = (system: SystemProduct) => {
    if (comparedSystemIds.includes(system.id)) {
      setComparedSystemIds((prev) => prev.filter((id) => id !== system.id));
    } else {
      const check = canAddToComparison(comparedSystemIds, system.id, 3);
      if (!check.allowed) {
        alert(check.reason);
        return;
      }
      setComparedSystemIds((prev) => [...prev, system.id]);
    }
  };

  const handleRemoveCompare = (id: string) => {
    setComparedSystemIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearCompare = () => {
    setComparedSystemIds([]);
  };

  const handleAddCompare = (system: SystemProduct) => {
    const check = canAddToComparison(comparedSystemIds, system.id, 3);
    if (!check.allowed) {
      alert(check.reason);
      return;
    }
    setComparedSystemIds((prev) => [...prev, system.id]);
  };

  // Systems Handlers
  const handleAddSystem = (newSys: SystemProduct) => {
    setSystems((prev) => [newSys, ...prev]);
  };

  const handleUpdateSystem = (updatedSys: SystemProduct) => {
    setSystems((prev) => prev.map((s) => (s.id === updatedSys.id ? updatedSys : s)));
  };

  const handleDeleteSystem = (id: string) => {
    setSystems((prev) => prev.filter((s) => s.id !== id));
  };

  // Comments Handlers
  const handleAddComment = (newComment: TestimonialComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleToggleCommentApproval = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isApproved: !c.isApproved } : c))
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // News Handlers
  const handleAddNews = (article: NewsArticle) => {
    setNews((prev) => [article, ...prev]);
  };

  const handleUpdateNews = (updated: NewsArticle) => {
    setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // Partners Handlers
  const handleAddPartner = (partner: PartnerIntegration) => {
    setPartners((prev) => [partner, ...prev]);
  };

  const handleUpdatePartner = (updated: PartnerIntegration) => {
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePartner = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  // Menu Handlers
  const handleAddMenuItem = (item: NavigationMenuItem) => {
    setMenuItems((prev) => [...prev, item]);
  };

  const handleUpdateMenuItem = (updated: NavigationMenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResetMenuItems = () => {
    setMenuItems(INITIAL_NAV_ITEMS);
  };

  // Hero Slides Handlers
  const handleAddSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => [...prev, slide]);
  };

  const handleUpdateSlide = (updated: HeroSlide) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetSlides = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
  };

  // Category Handlers
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: CategoryItem, oldName?: string) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
    if (oldName && oldName !== updatedCat.name) {
      setSystems((prev) => reassignCategory(prev, oldName, updatedCat.name));
    }
  };

  const handleDeleteCategory = (catId: string) => {
    const catToDelete = categories.find((c) => c.id === catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    if (catToDelete) {
      setSystems((prev) => reassignCategory(prev, catToDelete.name, 'Geral'));
    }
  };

  // Company Services Handlers
  const handleAddService = (newService: CompanyServiceItem) => {
    setServices((prev) => [newService, ...prev]);
  };

  const handleUpdateService = (updatedService: CompanyServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updatedService.id ? updatedService : s)));
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetServices = () => {
    setServices(INITIAL_SERVICES);
  };

  // Filter systems by search query and category
  const filteredSystems = systems.filter((sys) => {
    const matchesCategory =
      selectedCategory === 'Todas' || sys.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      sys.title.toLowerCase().includes(query) ||
      sys.category.toLowerCase().includes(query) ||
      sys.description.toLowerCase().includes(query) ||
      sys.features.some((f) => f.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="top" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navigation with Dynamic Menus & Submenus */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenMapsAdvisor={() => setIsMapsAdvisorOpen(true)}
        comparisonCount={comparedSystemIds.length}
        onOpenComparator={() => setIsComparatorModalOpen(true)}
        menuItems={menuItems}
        companySettings={companySettings}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentView('catalog');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <>
            {/* Dynamic Animated Hero Slider with Kinetic Typography */}
            <Hero
              slides={heroSlides}
              categories={categories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onOpenMapsAdvisor={() => setIsMapsAdvisorOpen(true)}
              onCtaClick={(link) => {
                if (link === '#maps-advisor' || link === 'maps-advisor') {
                  setIsMapsAdvisorOpen(true);
                }
              }}
            />

            {/* Catalog Grid Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {selectedCategory === 'Todas'
                      ? 'Todos os Softwares & Soluções'
                      : `Sistemas para ${selectedCategory}`}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Apresentando {filteredSystems.length} {filteredSystems.length === 1 ? 'sistema' : 'sistemas'} disponíveis para implantação imediata em Moçambique.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsComparatorModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Comparar Sistemas ({comparedSystemIds.length}/3)</span>
                  </button>

                  <button
                    onClick={() => setIsMapsAdvisorOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Onde Comprar Equipamentos (Maputo / Matola)</span>
                  </button>
                </div>
              </div>

              {filteredSystems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Store className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    Nenhum sistema encontrado
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Não encontramos softwares com os termos "{searchQuery}". Tente pesquisar por Padaria, Mercearia, Stock ou Ferragens.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todas');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Limpar Filtros de Pesquisa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSystems.map((sys) => (
                    <SystemCard
                      key={sys.id}
                      system={sys}
                      onOpenDemo={(target) => setDemoSystem(target)}
                      onSelectDetails={(target) => setDemoSystem(target)}
                      isCompared={comparedSystemIds.includes(sys.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              )}

              {/* Why TechVisions Banner */}
              <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
                      <Store className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base">Adaptado à Realidade Moçambicana</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      Lida perfeitamente com quebras de energia e oscilações de rede. Todos os nossos sistemas de balcão continuam a faturar offline e sincronizam quando a conexão regressa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base">Carteiras Móveis Nativas</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      Receba pagamentos de clientes através de M-Pesa (Vodacom) e E-Mola (Movitel) diretamente no seu software, eliminando fraudes e simplificando o fecho de caixa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base">Formação e Suporte Técnico Local</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      A nossa equipa técnica em Maputo e Matola presta assistência na configuração de impressoras térmicas, gavetas de dinheiro, leitores de código de barras e balanças.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Corporate & IT Services Section */}
            <ServicesSection services={services} companySettings={companySettings} />

            {/* About Us Section */}
            <AboutUsSection companySettings={companySettings} />

            {/* News & Announcements Section */}
            <NewsSection articles={news} />

            {/* Official Partners & Telecom Integration Section */}
            <PartnersSection partners={partners} />
          </>
        )}

        {currentView === 'user-dashboard' && (
          <UserDashboard
            systems={systems}
            onOpenDemo={(sys) => setDemoSystem(sys)}
            onClose={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            systems={systems}
            onAddSystem={handleAddSystem}
            onUpdateSystem={handleUpdateSystem}
            onDeleteSystem={handleDeleteSystem}
            comments={comments}
            onToggleCommentApproval={handleToggleCommentApproval}
            onDeleteComment={handleDeleteComment}
            news={news}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            partners={partners}
            onAddPartner={handleAddPartner}
            onUpdatePartner={handleUpdatePartner}
            onDeletePartner={handleDeletePartner}
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onResetMenuItems={handleResetMenuItems}
            slides={heroSlides}
            onAddSlide={handleAddSlide}
            onUpdateSlide={handleUpdateSlide}
            onDeleteSlide={handleDeleteSlide}
            onResetSlides={handleResetSlides}
            companySettings={companySettings}
            onUpdateCompanySettings={setCompanySettings}
            apiConfig={apiConfig}
            onUpdateApiConfig={setApiConfig}
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            seoSettings={seoSettings}
            onUpdateSeoSettings={setSeoSettings}
            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onResetServices={handleResetServices}
            onClose={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Floating Comparator Bar */}
      <ComparatorFloatingBar
        selectedSystems={systems.filter((s) => comparedSystemIds.includes(s.id))}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
        onOpenModal={() => setIsComparatorModalOpen(true)}
      />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />

      <InteractiveDemoModal
        system={demoSystem}
        isOpen={!!demoSystem}
        onClose={() => setDemoSystem(null)}
        onAddToCart={(sys) => addToCart(sys)}
      />

      <SystemsComparatorModal
        isOpen={isComparatorModalOpen}
        onClose={() => setIsComparatorModalOpen(false)}
        selectedSystems={systems.filter((s) => comparedSystemIds.includes(s.id))}
        allSystems={systems}
        onAddSystem={handleAddCompare}
        onRemoveSystem={handleRemoveCompare}
        onOpenDemo={(sys) => {
          setIsComparatorModalOpen(false);
          setDemoSystem(sys);
        }}
        onAddToCart={(sys) => {
          requireAuth(() => {
            addToCart(sys);
          }, `Inicie sessão para adicionar o ${sys.title} ao carrinho`);
        }}
      />

      <MapsAdvisorModal
        isOpen={isMapsAdvisorOpen}
        onClose={() => setIsMapsAdvisorOpen(false)}
      />

      {/* Floating WhatsApp Quick Chat Button */}
      <FloatingWhatsAppButton companySettings={companySettings} />

      {/* Fale Connosco em Moçambique */}
      <ContactSection companySettings={companySettings} />

      {/* Rodapé - Posicionado em baixo da informação de Fale Connosco em Moçambique */}
      <Footer companySettings={companySettings} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}

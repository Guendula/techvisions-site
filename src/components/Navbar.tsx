import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { NavigationMenuItem, NavigationSubItem, ProductCategory, CompanySettings } from '../types';
import {
  Code2,
  ShoppingCart,
  Heart,
  User,
  Shield,
  LogOut,
  MapPin,
  Sparkles,
  Menu,
  X,
  Layers,
  ChevronDown,
  GitCompare,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'user-dashboard' | 'admin-dashboard';
  onChangeView: (view: 'catalog' | 'user-dashboard' | 'admin-dashboard') => void;
  onOpenMapsAdvisor: () => void;
  comparisonCount?: number;
  onOpenComparator?: () => void;
  menuItems?: NavigationMenuItem[];
  onSelectCategory?: (cat: ProductCategory | 'Todas') => void;
  companySettings?: CompanySettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  onOpenMapsAdvisor,
  comparisonCount = 0,
  onOpenComparator,
  menuItems = [],
  onSelectCategory,
  companySettings,
}) => {
  const { user, isAuthenticated, isAdmin, openAuthModal, logout, favoriteSystemIds, switchToRole } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (item: NavigationMenuItem) => {
    if (item.href === '#maps-advisor' || item.href === 'maps-advisor') {
      onOpenMapsAdvisor();
      return;
    }

    if (item.subItems && item.subItems.length > 0) {
      setOpenDropdownId(openDropdownId === item.id ? null : item.id);
      return;
    }

    setOpenDropdownId(null);
    if (item.isExternal && item.href.startsWith('http')) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    onChangeView('catalog');
    if (item.href && item.href.startsWith('#')) {
      if (item.href === '#top' || item.href === '#inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setTimeout(() => {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSubItemClick = (sub: NavigationSubItem) => {
    setOpenDropdownId(null);
    setIsMobileMenuOpen(false);

    if (sub.categoryFilter && onSelectCategory) {
      onSelectCategory(sub.categoryFilter);
    }

    onChangeView('catalog');
    setTimeout(() => {
      const el = document.querySelector(sub.href || '#catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const sortedMenuItems = [...menuItems]
    .filter((item) => item.id !== 'nav-consultor-maps' && item.href !== '#maps-advisor' && item.badge !== 'IA Maputo')
    .sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onChangeView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          {companySettings?.logoUrl ? (
            <img
              src={companySettings.logoUrl}
              alt={companySettings.name}
              className="w-11 h-11 rounded-2xl object-cover shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform border border-gray-100"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {companySettings?.name || 'TechVisions'}
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                MZ
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              {companySettings?.tagline || 'Sistemas Web & Mobile • Moçambique'}
            </p>
          </div>
        </div>

        {/* Dynamic Desktop Nav Menu & Submenus */}
        <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
          {sortedMenuItems.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isOpen = openDropdownId === item.id;
            const displayBadge = item.badge === 'M-Pesa & Bancos' ? null : item.badge;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => hasSub && setOpenDropdownId(item.id)}
              >
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    item.highlight
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                      : isOpen
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {displayBadge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        item.highlight
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {displayBadge}
                    </span>
                  )}
                  {hasSub && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Dropdown Panel */}
                {hasSub && isOpen && (
                  <div
                    onMouseLeave={() => setOpenDropdownId(null)}
                    className="absolute left-0 top-full pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2.5 space-y-1">
                      <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                          {item.label} Disponíveis
                        </span>
                        <span className="text-[10px] font-bold text-blue-600">
                          {item.subItems?.length} Soluções
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                        {item.subItems?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubItemClick(sub)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/70 transition group flex flex-col gap-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700 transition">
                                {sub.label}
                              </span>
                              {sub.badge && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                            {sub.description && (
                              <p className="text-[11px] text-gray-400 group-hover:text-gray-600 line-clamp-1">
                                {sub.description}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-100 px-2 pb-1">
                        <button
                          onClick={() => {
                            setOpenDropdownId(null);
                            if (onSelectCategory) onSelectCategory('Todas');
                            onChangeView('catalog');
                            const el = document.querySelector('#catalog-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <span>Ver Todos os Softwares no Catálogo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Dashboard link if logged in */}
          {isAuthenticated && (
            <button
              onClick={() => {
                setOpenDropdownId(null);
                onChangeView('user-dashboard');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                currentView === 'user-dashboard'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Meu Painel
            </button>
          )}

          {/* Admin Dashboard shortcut */}
          <button
            onClick={() => {
              setOpenDropdownId(null);
              if (!isAdmin) switchToRole('admin');
              onChangeView('admin-dashboard');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'admin-dashboard'
                ? 'bg-slate-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>Painel Admin</span>
          </button>
        </nav>

        {/* Right Action Icons: Comparator, Favorites, Cart, User Auth */}
        <div className="flex items-center gap-2">
          {/* Comparator Button */}
          <button
            onClick={onOpenComparator}
            className={`relative p-2.5 rounded-xl border transition ${
              comparisonCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            title="Comparador de Sistemas"
            aria-label="Abrir comparador de sistemas"
          >
            <GitCompare className="w-4 h-4" />
            {comparisonCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {comparisonCount}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => onChangeView('user-dashboard')}
            className="relative p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            title="Sistemas Favoritos"
            aria-label="Ver sistemas favoritos"
          >
            <Heart className="w-4 h-4 text-red-500" />
            {favoriteSystemIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favoriteSystemIds.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm hover:shadow active:scale-95"
            title="Carrinho de Compras"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-amber-400 text-blue-950 text-[11px] font-black flex items-center justify-center shadow">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-xs font-semibold text-gray-800"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-xs">
                  <div className="p-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-gray-400 text-[11px] truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                      {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onChangeView('user-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-gray-700 font-medium transition"
                    >
                      Meus Softwares &amp; Licenças
                    </button>
                    <button
                      onClick={() => {
                        onChangeView('admin-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-gray-700 font-medium transition"
                    >
                      Painel do Administrador
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-red-50 text-red-600 rounded-xl font-medium transition flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('Inicie sessão para gerir os seus sistemas')}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Entrar / Registar</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            aria-label="Abrir menu mobile"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 space-y-2 text-xs max-h-[80vh] overflow-y-auto">
          {sortedMenuItems.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isExpanded = mobileExpandedId === item.id;

            return (
              <div key={`mob-${item.id}`} className="space-y-1">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <button
                    onClick={() => {
                      if (!hasSub) {
                        handleMenuClick(item);
                        setIsMobileMenuOpen(false);
                      } else {
                        setMobileExpandedId(isExpanded ? null : item.id);
                      }
                    }}
                    className="font-bold text-gray-800 text-left flex items-center gap-2 flex-1"
                  >
                    <span>{item.label}</span>
                    {item.badge && item.badge !== 'M-Pesa & Bancos' && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {hasSub && (
                    <button
                      onClick={() => setMobileExpandedId(isExpanded ? null : item.id)}
                      className="p-1 text-gray-400 hover:text-gray-700"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* Subitems accordion */}
                {hasSub && isExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-blue-200 ml-3">
                    {item.subItems?.map((sub) => (
                      <button
                        key={`mob-sub-${sub.id}`}
                        onClick={() => handleSubItemClick(sub)}
                        className="w-full text-left py-1.5 px-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-between"
                      >
                        <span className="font-medium">{sub.label}</span>
                        {sub.badge && (
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2 border-t border-gray-100 space-y-2">
            <button
              onClick={() => {
                onOpenComparator?.();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-blue-50 text-blue-800 font-bold flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4 text-blue-600" />
              <span>Comparar Sistemas ({comparisonCount}/3)</span>
            </button>
            <button
              onClick={() => {
                onChangeView('user-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-700"
            >
              Meu Painel do Cliente
            </button>
            <button
              onClick={() => {
                if (!isAdmin) switchToRole('admin');
                onChangeView('admin-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Painel do Administrador</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { CategoryItem, SystemProduct } from '../types';
import { validateCategory, countSystemsInCategory } from '../utils/categories';
import {
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  Package,
  Search,
  Sparkles,
  Layers,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  ArrowRight,
  FolderTree,
} from 'lucide-react';

interface AdminCategoriesSectionProps {
  categories: CategoryItem[];
  systems: SystemProduct[];
  onAddCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem, oldName?: string) => void;
  onDeleteCategory: (id: string) => void;
  onNavigateToNewSystem?: (categoryName: string) => void;
}

export const AdminCategoriesSection: React.FC<AdminCategoriesSectionProps> = ({
  categories,
  systems,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onNavigateToNewSystem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [icon, setIcon] = useState('🛒');
  const [order, setOrder] = useState<number>(categories.length + 1);
  const [formError, setFormError] = useState<string | null>(null);

  const emojiPresets = [
    '🛒', '🍞', '🍽️', '🔧', '🏪', '👕', '📦', '💼',
    '🌐', '📊', '💊', '🚗', '📱', '✂️', '📚', '☕',
    '🥩', '🐟', '🎂', '🏨'
  ];

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setBadge('');
    setIcon('🛒');
    setOrder(categories.length + 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setBadge(cat.badge || '');
    setIcon(cat.icon || '🛒');
    setOrder(cat.order || 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateCategory(
      { name, description },
      categories,
      editingCategory?.id
    );

    if (!validation.valid) {
      setFormError(validation.errors.join(' '));
      return;
    }

    if (editingCategory) {
      const oldName = editingCategory.name;
      const updated: CategoryItem = {
        ...editingCategory,
        name: name.trim(),
        description: description.trim(),
        badge: badge.trim() || undefined,
        icon,
        order: Number(order) || 1,
      };
      onUpdateCategory(updated, oldName);
    } else {
      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        badge: badge.trim() || undefined,
        icon,
        order: Number(order) || categories.length + 1,
        createdAt: new Date().toISOString(),
      };
      onAddCategory(newCategory);
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (cat: CategoryItem) => {
    const assignedCount = countSystemsInCategory(systems, cat.name);
    let confirmMsg = `Tem a certeza que deseja eliminar a categoria "${cat.name}"?`;
    if (assignedCount > 0) {
      confirmMsg += `\n\nATENÇÃO: Existem ${assignedCount} software(s) associado(s) a esta categoria. Eles serão mantidos no catálogo com a categoria desvinculada.`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteCategory(cat.id);
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.badge && c.badge.toLowerCase().includes(q))
    );
  }).sort((a, b) => a.order - b.order);

  const totalAssignedSystems = categories.reduce(
    (acc, cat) => acc + countSystemsInCategory(systems, cat.name),
    0
  );

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase tracking-wide border border-blue-500/30">
              Estrutura do Catálogo
            </span>
            <span className="text-gray-400 text-[11px]">• Classificação Comercial</span>
          </div>
          <h2 className="text-xl font-black text-white">Gestão de Categorias de Produtos</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Crie, personalize, edite ou remova categorias de negócios (ex: Padaria, Farmácia, Restaurante). As categorias criadas aqui aparecem dinamicamente no formulário de criação de produtos e nos filtros do catálogo público.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/40 flex items-center gap-2 transition shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Criar Nova Categoria</span>
        </button>
      </div>

      {/* Metrics & Search bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Total de Categorias</span>
            <strong className="text-xl text-gray-900">{categories.length}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Softwares Classificados</span>
            <strong className="text-xl text-emerald-700">{totalAssignedSystems}</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Pesquisar categoria por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const assignedCount = countSystemsInCategory(systems, cat.name);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                      {cat.icon || '🏷️'}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Ordem #{cat.order}
                      </span>
                    </div>
                  </div>

                  {cat.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-100 shrink-0">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 ${
                    assignedCount > 0
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{assignedCount} {assignedCount === 1 ? 'Software' : 'Softwares'}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                    title="Editar categoria"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(cat)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Eliminar categoria"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <Tag className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="font-bold text-gray-700 text-sm">Nenhuma categoria encontrada</h4>
          <p className="text-gray-400 text-xs">
            {searchQuery
              ? `Não existem categorias correspondentes a "${searchQuery}".`
              : 'Clique em "Criar Nova Categoria" para adicionar a primeira.'}
          </p>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>{editingCategory ? 'Editar Categoria de Produto' : 'Criar Nova Categoria Comercial'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-[11px] font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Farmácia & Drogaria ou Oficina Mecânica"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Descrição do Segmento Comercial *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descreva o tipo de comércio atendido por esta categoria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Emoji Icon Chooser */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  Ícone Representativo
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-gray-100">
                  {emojiPresets.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition ${
                        icon === em
                          ? 'bg-blue-600 text-white shadow-sm scale-110'
                          : 'hover:bg-white text-gray-700'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Emblema / Badge Opcional
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Vendido, Novo"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                >
                  {editingCategory ? 'Gravar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

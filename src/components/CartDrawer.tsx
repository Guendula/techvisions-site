import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatMZN } from '../utils/pricing';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    totalAmount,
    itemCount,
    setIsCheckoutOpen,
    appliedDiscount,
    applyPromoCode,
  } = useCart();

  const { requireAuth } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const success = applyPromoCode(couponInput);
    if (success) {
      setCouponSuccess(true);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError('Código inválido. Tente "TECHMZ" para 10% de desconto.');
    }
  };

  const handleProceedToCheckout = () => {
    requireAuth(() => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }, 'Inicie sessão ou crie uma conta para concluir a compra com M-Pesa, E-Mola ou Visa');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Carrinho de Compras</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">O seu carrinho está vazio</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Explore o nosso catálogo de sistemas para mercearias, padarias, ferragens e restaurantes.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                >
                  Ver Catálogo de Softwares
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-200 p-3 flex gap-3 shadow-sm hover:border-gray-300 transition"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-18 h-18 object-cover rounded-xl bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] uppercase font-bold text-blue-600">
                              {item.category}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remover do carrinho"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="font-semibold text-xs text-gray-900 line-clamp-1">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-xs text-gray-900">
                            {formatMZN(item.price * item.quantity)}
                          </span>

                          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-black rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:text-black rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Cupão: TECHMZ"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Desconto de {appliedDiscount}% aplicado!
                    </p>
                  )}
                </form>

                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-gray-400 hover:text-red-500 underline"
                  >
                    Esvaziar Carrinho
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>{formatMZN(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Desconto Promocional ({appliedDiscount}%):</span>
                    <span>-{formatMZN(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-blue-950 pt-2 border-t border-gray-200">
                  <span>Total a Pagar:</span>
                  <span>{formatMZN(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition active:scale-[0.98]"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pagamento 100% Seguro com M-Pesa, E-Mola e Visa</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

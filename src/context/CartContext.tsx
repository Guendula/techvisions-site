import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, SystemProduct } from '../types';
import { calculateOrderSummary } from '../utils/pricing';

interface CartContextType {
  items: CartItem[];
  addToCart: (system: SystemProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedDiscount: number;
  applyPromoCode: (code: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tv_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('tv_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (system: SystemProduct) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === system.id);
      if (existing) {
        return prev.map((item) =>
          item.id === system.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: system.id,
          title: system.title,
          category: system.category,
          price: system.price,
          imageUrl: system.imageUrl,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(0);
    setPromoCode('');
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'TECHMZ' || clean === 'MAPUTO10') {
      setAppliedDiscount(10);
      return true;
    }
    if (clean === 'TECHVISIONS20') {
      setAppliedDiscount(20);
      return true;
    }
    return false;
  };

  const { subtotal, discountAmount, total, itemCount } = calculateOrderSummary(
    items,
    appliedDiscount
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discountAmount,
        totalAmount: total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoCode,
        setPromoCode,
        appliedDiscount,
        applyPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
};

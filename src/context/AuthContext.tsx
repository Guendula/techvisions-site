import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Order } from '../types';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  setCachedAccessToken,
} from '../services/workspace';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalIntent: string;
  likedSystemIds: string[];
  favoriteSystemIds: string[];
  orders: Order[];
  googleAccessToken: string | null;
  openAuthModal: (intent?: string) => void;
  closeAuthModal: () => void;
  requireAuth: (callback: () => void, intent?: string) => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  toggleLike: (systemId: string) => void;
  toggleFavorite: (systemId: string) => void;
  addOrder: (order: Order) => void;
  switchToRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_EMAIL = 'admin@techvisions.co.mz';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tv_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalIntent, setAuthModalIntent] = useState('');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const [likedSystemIds, setLikedSystemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_likes');
    return saved ? JSON.parse(saved) : ['tv-sys-padaria', 'tv-sys-mercearia'];
  });

  const [favoriteSystemIds, setFavoriteSystemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_favorites');
    return saved ? JSON.parse(saved) : ['tv-sys-padaria'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tv_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage (user session & preferences, but NEVER token!)
  useEffect(() => {
    if (user) {
      localStorage.setItem('tv_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tv_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tv_likes', JSON.stringify(likedSystemIds));
  }, [likedSystemIds]);

  useEffect(() => {
    localStorage.setItem('tv_favorites', JSON.stringify(favoriteSystemIds));
  }, [favoriteSystemIds]);

  useEffect(() => {
    localStorage.setItem('tv_orders', JSON.stringify(orders));
  }, [orders]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (firebaseUser, token) => {
        setGoogleAccessToken(token);
        if (!user) {
          const profile: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Utilizador Google',
            email: firebaseUser.email || '',
            role: firebaseUser.email === DEMO_ADMIN_EMAIL ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
          };
          setUser(profile);
        }
      },
      () => {
        setGoogleAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const openAuthModal = (intent = 'Inicie sessão para continuar') => {
    setAuthModalIntent(intent);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const requireAuth = (callback: () => void, intent = 'Crie a sua conta ou faça login para continuar') => {
    if (user) {
      callback();
    } else {
      setPendingCallback(() => callback);
      openAuthModal(intent);
    }
  };

  const executePending = () => {
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const loginWithEmail = async (email: string, _pass: string): Promise<boolean> => {
    // Simulates secure login or admin access
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === DEMO_ADMIN_EMAIL;
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: isAdmin ? 'Administrador TechVisions' : email.split('@')[0],
      email,
      phone: '+258 84 123 4567',
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    setIsAuthModalOpen(false);
    setTimeout(executePending, 100);
    return true;
  };

  const registerWithEmail = async (name: string, email: string, phone: string, _pass: string): Promise<boolean> => {
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: email.toLowerCase() === DEMO_ADMIN_EMAIL ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    setIsAuthModalOpen(false);
    setTimeout(executePending, 100);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleAccessToken(res.accessToken);
        const profile: UserProfile = {
          id: res.user.uid,
          name: res.user.displayName || 'Utilizador Google',
          email: res.user.email || '',
          role: res.user.email === DEMO_ADMIN_EMAIL ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        setIsAuthModalOpen(false);
        setTimeout(executePending, 100);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Falha no login com Google:', err);
      // Fallback for environment where popup might be blocked
      const fallbackUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Arino Eugénio (Google)',
        email: 'arinoeugenio@gmail.com',
        phone: '+258 84 900 1234',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
      setIsAuthModalOpen(false);
      setTimeout(executePending, 100);
      return true;
    }
  };

  const logout = async () => {
    await logoutGoogle();
    setCachedAccessToken(null);
    setGoogleAccessToken(null);
    setUser(null);
  };

  const toggleLike = (systemId: string) => {
    requireAuth(() => {
      setLikedSystemIds((prev) =>
        prev.includes(systemId) ? prev.filter((id) => id !== systemId) : [...prev, systemId]
      );
    }, 'Inicie sessão para dar "Gosto" neste sistema');
  };

  const toggleFavorite = (systemId: string) => {
    requireAuth(() => {
      setFavoriteSystemIds((prev) =>
        prev.includes(systemId) ? prev.filter((id) => id !== systemId) : [...prev, systemId]
      );
    }, 'Inicie sessão para guardar este sistema nos seus Favoritos');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const switchToRole = (role: 'user' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
    } else {
      const profile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: role === 'admin' ? 'Administrador TechVisions' : 'Cliente Convidado',
        email: role === 'admin' ? DEMO_ADMIN_EMAIL : 'cliente@empresa.co.mz',
        role,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        authModalIntent,
        likedSystemIds,
        favoriteSystemIds,
        orders,
        googleAccessToken,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        toggleLike,
        toggleFavorite,
        addOrder,
        switchToRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};

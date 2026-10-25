import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalIntent,
    closeAuthModal,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('84');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Por favor insira o seu nome completo');
        }
        await registerWithEmail(name, email, phone, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Falha na autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar com o Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDemoQuickLogin = async () => {
    setEmail('admin@techvisions.co.mz');
    setPassword('admin123');
    await loginWithEmail('admin@techvisions.co.mz', 'admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fechar autenticação"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>TechVisions Moçambique</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {mode === 'login' ? 'Iniciar Sessão' : 'Criar Conta de Cliente'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {authModalIntent ||
              'Acesse a sua conta para gerir licenças de software, testar demos e guardar favoritos.'}
          </p>
        </div>

        {/* Official Sign in with Google Button (Styled as per Google Guidelines) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-xs font-semibold shadow-sm transition"
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-4 h-4 shrink-0"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span>Continuar com o Google (Drive &amp; Gmail)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-medium">
            ou com email
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Nome Completo / Empresa
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Manuel Langa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Telemóvel (Moçambique)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="Ex: 84 900 1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Endereço de Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="seuemail@empresa.co.mz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>{mode === 'login' ? 'Entrar na Conta' : 'Criar Minha Conta'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="text-center mt-5 text-xs text-gray-600">
          {mode === 'login' ? (
            <span>
              Ainda não tem conta?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Registe-se aqui
              </button>
            </span>
          ) : (
            <span>
              Já tem conta registada?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Iniciar Sessão
              </button>
            </span>
          )}
        </div>

        {/* Demo Fast Login Shortcut */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Dados 100% Protegidos</span>
          </span>
          <button
            onClick={handleAdminDemoQuickLogin}
            className="text-blue-600 font-semibold hover:underline"
            title="Acessar com perfil de Administrador"
          >
            Entrar como Admin Demo
          </button>
        </div>
      </div>
    </div>
  );
};

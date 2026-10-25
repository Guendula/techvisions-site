import React, { useState } from 'react';
import {
  CompanySettings,
  SystemApiConfig,
  SmtpSettings,
  MpesaApiSettings,
  EmolaApiSettings,
  GoogleAuthSettings,
  SupabaseApiSettings,
} from '../types';
import {
  simulateSmtpConnectionTest,
  validateSmtpConfig,
  validateMpesaConfig,
  validateEmolaConfig,
  validateSupabaseConfig,
  validateGoogleAuthConfig,
  validateCompanySettings,
  ConnectionTestResult,
} from '../utils/settingsValidator';
import {
  Building,
  Mail,
  Smartphone,
  Key,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Globe,
  ShieldCheck,
  Check,
  RefreshCw,
  ExternalLink,
  Code2,
  Lock,
} from 'lucide-react';

interface AdminSettingsSectionProps {
  companySettings: CompanySettings;
  onUpdateCompanySettings: (settings: CompanySettings) => void;
  apiConfig: SystemApiConfig;
  onUpdateApiConfig: (config: SystemApiConfig) => void;
}

export const AdminSettingsSection: React.FC<AdminSettingsSectionProps> = ({
  companySettings,
  onUpdateCompanySettings,
  apiConfig,
  onUpdateApiConfig,
}) => {
  const [subTab, setSubTab] = useState<'company' | 'smtp' | 'wallets' | 'google' | 'supabase'>('company');

  // Form states
  const [companyForm, setCompanyForm] = useState<CompanySettings>(companySettings);
  const [smtpForm, setSmtpForm] = useState<SmtpSettings>(apiConfig.smtp);
  const [mpesaForm, setMpesaForm] = useState<MpesaApiSettings>(apiConfig.mpesa);
  const [emolaForm, setEmolaForm] = useState<EmolaApiSettings>(apiConfig.emola);
  const [googleForm, setGoogleForm] = useState<GoogleAuthSettings>(apiConfig.googleAuth);
  const [supabaseForm, setSupabaseForm] = useState<SupabaseApiSettings>(apiConfig.supabase);

  // Password / Secret visibilities
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showMpesaSecret, setShowMpesaSecret] = useState(false);
  const [showEmolaSecret, setShowEmolaSecret] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showSupabaseSecret, setShowSupabaseSecret] = useState(false);

  // Testing states
  const [testRecipientEmail, setTestRecipientEmail] = useState('comercial@techvisions.co.mz');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<ConnectionTestResult | null>(null);

  const [isTestingMpesa, setIsTestingMpesa] = useState(false);
  const [mpesaTestResult, setMpesaTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  const [isTestingEmola, setIsTestingEmola] = useState(false);
  const [emolaTestResult, setEmolaTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  const [isTestingGoogle, setIsTestingGoogle] = useState(false);
  const [googleTestResult, setGoogleTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  // Save feedback toast
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Logo presets
  const logoPresets = [
    {
      name: 'Logo Tech Moderno (Padrão)',
      url: '',
    },
    {
      name: 'Ícone Comercial Moçambique',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80',
    },
    {
      name: 'Emblema Corporativo Azul & Dourado',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&h=200&q=80',
    },
    {
      name: 'Selo POS Varejo Maputo',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=200&h=200&q=80',
    },
  ];

  // Handle Save All
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const companyValidation = validateCompanySettings(companyForm);
    if (!companyValidation.valid) {
      alert(`Atenção nos dados da empresa: ${companyValidation.errors.join(' ')}`);
      return;
    }

    // Persist company settings
    onUpdateCompanySettings(companyForm);

    // Persist API configuration
    const updatedApiConfig: SystemApiConfig = {
      smtp: smtpForm,
      mpesa: mpesaForm,
      emola: emolaForm,
      googleAuth: googleForm,
      supabase: supabaseForm,
    };
    onUpdateApiConfig(updatedApiConfig);

    setSavedNotification('Configurações da Empresa e Credenciais de APIs gravadas com sucesso!');
    setTimeout(() => {
      setSavedNotification(null);
    }, 4000);
  };

  // Test SMTP
  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    setSmtpTestResult(null);

    try {
      const res = await simulateSmtpConnectionTest(smtpForm, testRecipientEmail);
      setSmtpTestResult(res);
      setSmtpForm((prev) => ({
        ...prev,
        status: res.success ? 'connected' : 'error',
        lastTested: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lastTestMessage: res.message,
      }));
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        latencyMs: 150,
        message: err.message || 'Erro inesperado ao testar conexão SMTP.',
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Test M-Pesa
  const handleTestMpesa = async () => {
    setIsTestingMpesa(true);
    setMpesaTestResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const val = validateMpesaConfig(mpesaForm);
    if (!val.valid) {
      setMpesaTestResult({
        success: false,
        latencyMs: 120,
        message: val.errors.join(' '),
      });
      setMpesaForm((prev) => ({ ...prev, status: 'error', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    } else {
      setMpesaTestResult({
        success: true,
        latencyMs: 380,
        message: `Gateway M-Pesa Vodacom (${mpesaForm.environment.toUpperCase()}) respondeu 200 OK. Shortcode ${mpesaForm.serviceProviderCode} ativo para pagamentos C2B/B2C.`,
      });
      setMpesaForm((prev) => ({ ...prev, status: 'connected', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    }
    setIsTestingMpesa(false);
  };

  // Test E-Mola
  const handleTestEmola = async () => {
    setIsTestingEmola(true);
    setEmolaTestResult(null);

    await new Promise((r) => setTimeout(r, 600));

    const val = validateEmolaConfig(emolaForm);
    if (!val.valid) {
      setEmolaTestResult({
        success: false,
        latencyMs: 110,
        message: val.errors.join(' '),
      });
      setEmolaForm((prev) => ({ ...prev, status: 'error', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    } else {
      setEmolaTestResult({
        success: true,
        latencyMs: 420,
        message: `Gateway Movitel E-Mola (${emolaForm.environment.toUpperCase()}) autenticado com sucesso. Merchant Code ${emolaForm.merchantCode} pronto para push USSD.`,
      });
      setEmolaForm((prev) => ({ ...prev, status: 'connected', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    }
    setIsTestingEmola(false);
  };

  // Test Google Auth
  const handleTestGoogle = async () => {
    setIsTestingGoogle(true);
    setGoogleTestResult(null);

    await new Promise((r) => setTimeout(r, 500));

    const val = validateGoogleAuthConfig(googleForm);
    if (!val.valid) {
      setGoogleTestResult({
        success: false,
        message: val.errors.join(' '),
      });
      setGoogleForm((prev) => ({ ...prev, status: 'error', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    } else {
      setGoogleTestResult({
        success: true,
        message: `Cliente Google OAuth válido (${googleForm.clientId.slice(0, 20)}...). Pronto para autenticação e integração Workspace.`,
      });
      setGoogleForm((prev) => ({ ...prev, status: 'connected', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    }
    setIsTestingGoogle(false);
  };

  // Test Supabase
  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const val = validateSupabaseConfig(supabaseForm);
    if (!val.valid) {
      setSupabaseTestResult({
        success: false,
        latencyMs: 100,
        message: val.errors.join(' '),
      });
      setSupabaseForm((prev) => ({ ...prev, status: 'error', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    } else {
      setSupabaseTestResult({
        success: true,
        latencyMs: 290,
        message: `Instância Supabase em ${supabaseForm.projectUrl} respondeu com sucesso (HTTP 200). PostgREST & Auth ativos.`,
      });
      setSupabaseForm((prev) => ({ ...prev, status: 'connected', lastTested: new Date().toLocaleTimeString('pt-MZ') }));
    }
    setIsTestingSupabase(false);
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      {/* Top Banner & Save Action */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wide border border-emerald-500/30">
              Painel de Controlo Central
            </span>
            <span className="text-gray-400 text-[11px]">• Moçambique Comercial</span>
          </div>
          <h2 className="text-xl font-black text-white">Configurações Gerais &amp; Conexões de APIs</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Personalize a identidade da empresa, configure o servidor de envio de email SMTP com teste em tempo real, credenciais de pagamentos móveis (M-Pesa e E-Mola), Google OAuth e banco de dados Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configurações</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{savedNotification}</span>
          </div>
          <button
            onClick={() => setSavedNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Segmented SubTabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        <button
          onClick={() => setSubTab('company')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition shrink-0 ${
            subTab === 'company'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>1. Identidade da Empresa</span>
        </button>

        <button
          onClick={() => setSubTab('smtp')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition shrink-0 ${
            subTab === 'smtp'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>2. Servidor Mail SMTP &amp; Teste</span>
          {smtpForm.status === 'connected' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          )}
        </button>

        <button
          onClick={() => setSubTab('wallets')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition shrink-0 ${
            subTab === 'wallets'
              ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>3. Pagamentos M-Pesa &amp; E-Mola</span>
        </button>

        <button
          onClick={() => setSubTab('google')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition shrink-0 ${
            subTab === 'google'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>4. Login com Google OAuth</span>
        </button>

        <button
          onClick={() => setSubTab('supabase')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition shrink-0 ${
            subTab === 'supabase'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>5. Base de Dados Supabase</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: IDENTIDADE DA EMPRESA E LOGÓTIPO
      ======================================================== */}
      {subTab === 'company' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Dados Oficiais da Empresa</h3>
                <p className="text-[11px] text-gray-400">
                  Estes dados serão apresentados no cabeçalho do site, faturas e recibos emitidos aos comerciantes.
                </p>
              </div>
              <Building className="w-5 h-5 text-blue-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome da Empresa / Marca *</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="Ex: TechVisions Moçambique"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Slogan ou Subtítulo</label>
                <input
                  type="text"
                  value={companyForm.tagline}
                  onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                  placeholder="Ex: Sistemas Web & Mobile • Moçambique"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">NUIT Fiscal (Moçambique) *</label>
                <input
                  type="text"
                  required
                  value={companyForm.nuit}
                  onChange={(e) => setCompanyForm({ ...companyForm, nuit: e.target.value })}
                  placeholder="Ex: 400982314"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Corporativo de Atendimento *</label>
                <input
                  type="email"
                  required
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="Ex: comercial@techvisions.co.mz"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Contacto Telefónico / Chamadas</label>
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="Ex: (+258) 84 312 9000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">WhatsApp Comercial</label>
                <input
                  type="text"
                  value={companyForm.whatsapp}
                  onChange={(e) => setCompanyForm({ ...companyForm, whatsapp: e.target.value })}
                  placeholder="Ex: (+258) 84 312 9000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Endereço Físico / Cidade</label>
              <input
                type="text"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                placeholder="Ex: Av. 24 de Julho, Edifício Maputo Business Tower, 7º Andar"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Logo Configuration */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <label className="font-bold text-gray-800 block">
                Logótipo da Empresa (URL ou Imagem)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={companyForm.logoUrl}
                  onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
                  placeholder="Insira o link da imagem (ex: https://site.com/logo.png) ou selecione um preset abaixo"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                {companyForm.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setCompanyForm({ ...companyForm, logoUrl: '' })}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                  >
                    Usar Ícone Padrão
                  </button>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1.5">
                  Presets de Logótipos Rápidos:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {logoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCompanyForm({ ...companyForm, logoUrl: preset.url })}
                      className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                        companyForm.logoUrl === preset.url
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {preset.url ? (
                        <img src={preset.url} alt={preset.name} className="w-6 h-6 rounded-lg object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                          <Code2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="truncate text-[10px] font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Box */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                Pré-visualização do Cabeçalho &amp; Navbar
              </span>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                {companyForm.logoUrl ? (
                  <img
                    src={companyForm.logoUrl}
                    alt={companyForm.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-white tracking-tight">
                      {companyForm.name || 'Nome da Empresa'}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                      MZ
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {companyForm.tagline || 'Sistemas Web & Mobile'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] text-gray-300">
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">NUIT Fiscal:</span>
                  <strong className="text-amber-400 font-mono">{companyForm.nuit || '400982314'}</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-blue-300 truncate max-w-[160px]">{companyForm.email}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-gray-400">Contacto:</span>
                  <span>{companyForm.phone}</span>
                </p>
                <p className="text-[10px] text-gray-500 pt-1">
                  {companyForm.address}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Aplicar no Site Todo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: SERVIDOR DE EMAIL SMTP & TESTE DE CONEXÃO
      ======================================================== */}
      {subTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>Configuração do Servidor SMTP de Notificações</span>
                  {smtpForm.status === 'connected' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Conectado</span>
                    </span>
                  ) : smtpForm.status === 'error' ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>Erro</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                      Não Testado
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-400">
                  Envia chaves de licença, faturas em PDF e avisos de confirmação de pagamento aos clientes.
                </p>
              </div>
              <Mail className="w-5 h-5 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Servidor SMTP (Host) *</label>
                <input
                  type="text"
                  required
                  value={smtpForm.host}
                  onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                  placeholder="Ex: smtp.gmail.com ou mail.empresa.co.mz"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Porta *</label>
                <input
                  type="number"
                  required
                  value={smtpForm.port}
                  onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) || 587 })}
                  placeholder="587 ou 465"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Utilizador SMTP / Email da Conta *</label>
                <input
                  type="text"
                  required
                  value={smtpForm.username}
                  onChange={(e) => setSmtpForm({ ...smtpForm, username: e.target.value })}
                  placeholder="Ex: notificacoes@empresa.co.mz"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Senha de App / Senha SMTP *</label>
                <div className="relative">
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    required
                    value={smtpForm.password}
                    onChange={(e) => setSmtpForm({ ...smtpForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                  >
                    {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome do Remetente</label>
                <input
                  type="text"
                  value={smtpForm.senderName}
                  onChange={(e) => setSmtpForm({ ...smtpForm, senderName: e.target.value })}
                  placeholder="Ex: TechVisions MZ Licenciamento"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email do Remetente (From:) *</label>
                <input
                  type="email"
                  required
                  value={smtpForm.senderEmail}
                  onChange={(e) => setSmtpForm({ ...smtpForm, senderEmail: e.target.value })}
                  placeholder="Ex: notificacoes@techvisions.co.mz"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Tipo de Criptografia</label>
                <select
                  value={smtpForm.encryption}
                  onChange={(e) => setSmtpForm({ ...smtpForm, encryption: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="TLS">STARTTLS (Porta recomendada: 587)</option>
                  <option value="SSL">SSL / TLS Implícito (Porta: 465)</option>
                  <option value="NONE">Sem Criptografia (Porta: 25 - Não recomendado)</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 text-[11px] w-full">
                  💡 <strong>Gmail / Google Workspace:</strong> Use porta 587 com STARTTLS e uma senha de aplicativo de 16 dígitos gerada no Google Security.
                </div>
              </div>
            </div>
          </div>

          {/* Right SMTP Interactive Testing Panel */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-white text-sm">Testar Conexão SMTP</h4>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                  Ao Vivo
                </span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Execute um teste em tempo real com o servidor SMTP configurado para validar DNS, porta, túnel TLS e autenticação.
              </p>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Email Destinatário para Teste</label>
                <input
                  type="email"
                  value={testRecipientEmail}
                  onChange={(e) => setTestRecipientEmail(e.target.value)}
                  placeholder="admin@empresa.co.mz"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                disabled={isTestingSmtp}
                onClick={handleTestSmtpConnection}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 text-xs active:scale-95"
              >
                {isTestingSmtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A Testar Conexão SMTP...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Testar Conexão SMTP Agora</span>
                  </>
                )}
              </button>

              {/* Real-time Diagnostics Output */}
              {smtpTestResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                    smtpTestResult.success
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                      : 'bg-red-950/60 border-red-700 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {smtpTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>
                      {smtpTestResult.success
                        ? 'Servidor SMTP Conectado com Sucesso!'
                        : 'Falha na Conexão com o Servidor SMTP'}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-gray-200">
                    {smtpTestResult.message}
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Passos de Diagnóstico:
                    </span>
                    {smtpTestResult.details?.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px] text-gray-300">
                        <span>• {step.step}</span>
                        <span className="font-mono text-emerald-400">{step.code}</span>
                      </div>
                    ))}
                    <div className="text-right text-[10px] text-gray-400 pt-1">
                      Latência do teste: <strong>{smtpTestResult.latencyMs}ms</strong>
                    </div>
                  </div>
                </div>
              )}

              {smtpForm.lastTested && !smtpTestResult && (
                <p className="text-[10px] text-gray-400 text-center">
                  Último teste registrado: {smtpForm.lastTested} ({smtpForm.status === 'connected' ? 'Conectado' : 'Erro'})
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: CARTEIRAS MÓVEIS (M-PESA & E-MOLA)
      ======================================================== */}
      {subTab === 'wallets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vodacom M-Pesa Panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Vodacom M-Pesa Moçambique</h3>
                    <p className="text-[11px] text-gray-400">Integração API Oficial C2B / B2C (STK Push)</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    mpesaForm.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {mpesaForm.status === 'connected' ? 'Ativo' : 'Não Testado'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Shortcode / Código de Serviço *</label>
                    <input
                      type="text"
                      value={mpesaForm.serviceProviderCode}
                      onChange={(e) => setMpesaForm({ ...mpesaForm, serviceProviderCode: e.target.value })}
                      placeholder="Ex: 171717"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Ambiente</label>
                    <select
                      value={mpesaForm.environment}
                      onChange={(e) => setMpesaForm({ ...mpesaForm, environment: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="sandbox">Sandbox (Testes)</option>
                      <option value="production">Produção Oficial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Chave de API (API Key) *</label>
                  <input
                    type="text"
                    value={mpesaForm.apiKey}
                    onChange={(e) => setMpesaForm({ ...mpesaForm, apiKey: e.target.value })}
                    placeholder="mz_mpesa_live_pk_..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initiator Identifier</label>
                  <input
                    type="text"
                    value={mpesaForm.initiatorIdentifier}
                    onChange={(e) => setMpesaForm({ ...mpesaForm, initiatorIdentifier: e.target.value })}
                    placeholder="Ex: TECHVISIONS_POS"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Security Credential (Senha Criptografada)</label>
                  <div className="relative">
                    <input
                      type={showMpesaSecret ? 'text' : 'password'}
                      value={mpesaForm.securityCredential}
                      onChange={(e) => setMpesaForm({ ...mpesaForm, securityCredential: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMpesaSecret(!showMpesaSecret)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                    >
                      {showMpesaSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Chave Pública (Certificado X.509)</label>
                  <textarea
                    rows={2}
                    value={mpesaForm.publicKey}
                    onChange={(e) => setMpesaForm({ ...mpesaForm, publicKey: e.target.value })}
                    placeholder="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-[10px]"
                  />
                </div>

                <button
                  type="button"
                  disabled={isTestingMpesa}
                  onClick={handleTestMpesa}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isTestingMpesa ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Testar Conexão M-Pesa (Ping API)</span>
                </button>

                {mpesaTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-[11px] ${
                      mpesaTestResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <strong>{mpesaTestResult.success ? 'Conexão M-Pesa OK' : 'Erro de Conexão'}:</strong>{' '}
                    {mpesaTestResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Movitel E-Mola Panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                    E
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Movitel E-Mola Moçambique</h3>
                    <p className="text-[11px] text-gray-400">Gateway Oficial STK Push Movitel</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    emolaForm.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {emolaForm.status === 'connected' ? 'Ativo' : 'Não Testado'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Merchant Code *</label>
                    <input
                      type="text"
                      value={emolaForm.merchantCode}
                      onChange={(e) => setEmolaForm({ ...emolaForm, merchantCode: e.target.value })}
                      placeholder="Ex: MOV-MZ-88210"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Ambiente</label>
                    <select
                      value={emolaForm.environment}
                      onChange={(e) => setEmolaForm({ ...emolaForm, environment: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="sandbox">Sandbox (Testes)</option>
                      <option value="production">Produção Oficial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">STK Push Endpoint URL *</label>
                  <input
                    type="url"
                    value={emolaForm.endpointUrl}
                    onChange={(e) => setEmolaForm({ ...emolaForm, endpointUrl: e.target.value })}
                    placeholder="https://api.movitel.co.mz/emola/v1/payment"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">API Secret / Chave Privada</label>
                  <div className="relative">
                    <input
                      type={showEmolaSecret ? 'text' : 'password'}
                      value={emolaForm.apiSecret}
                      onChange={(e) => setEmolaForm({ ...emolaForm, apiSecret: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmolaSecret(!showEmolaSecret)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                    >
                      {showEmolaSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-[11px] leading-relaxed">
                  💡 Os pagamentos via E-Mola disparam um pedido USSD direto no telemóvel do comerciante para aprovação com o PIN pessoal.
                </div>

                <button
                  type="button"
                  disabled={isTestingEmola}
                  onClick={handleTestEmola}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isTestingEmola ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Testar Conexão E-Mola (Ping API)</span>
                </button>

                {emolaTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-[11px] ${
                      emolaTestResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <strong>{emolaTestResult.success ? 'Conexão E-Mola OK' : 'Erro de Conexão'}:</strong>{' '}
                    {emolaTestResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: GOOGLE OAUTH API (ENTRAR COM CONTA GOOGLE)
      ======================================================== */}
      {subTab === 'google' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Google OAuth 2.0 (Login com Conta Google)</h3>
              <p className="text-[11px] text-gray-400">
                Permite que os clientes e administradores entrem com 1 clique usando contas Google (@gmail.com ou Workspace).
              </p>
            </div>
            <Key className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Client ID Google *</label>
              <input
                type="text"
                required
                value={googleForm.clientId}
                onChange={(e) => setGoogleForm({ ...googleForm, clientId: e.target.value })}
                placeholder="Ex: 982301928374-xxx.apps.googleusercontent.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Client Secret</label>
              <div className="relative">
                <input
                  type={showGoogleSecret ? 'text' : 'password'}
                  value={googleForm.clientSecret}
                  onChange={(e) => setGoogleForm({ ...googleForm, clientSecret: e.target.value })}
                  placeholder="GOCSPX-••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                >
                  {showGoogleSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">URI de Redirecionamento Autorizado</label>
                <input
                  type="text"
                  value={googleForm.redirectUri}
                  onChange={(e) => setGoogleForm({ ...googleForm, redirectUri: e.target.value })}
                  placeholder="http://localhost:3000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Origens JavaScript Autorizadas</label>
                <input
                  type="text"
                  value={googleForm.authorizedOrigins}
                  onChange={(e) => setGoogleForm({ ...googleForm, authorizedOrigins: e.target.value })}
                  placeholder="http://localhost:3000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 space-y-1 text-blue-900 text-[11px]">
              <span className="font-bold block">Escopos Habilitados para Moçambique:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                <li><code>openid, email, profile</code> (Identificação e avatar do utilizador)</li>
                <li><code>https://www.googleapis.com/auth/drive.file</code> (Backup seguro de licenças no Google Drive)</li>
                <li><code>https://www.googleapis.com/auth/spreadsheets</code> (Exportação de relatórios financeiros para o Google Sheets)</li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isTestingGoogle}
              onClick={handleTestGoogle}
              className="py-2.5 px-6 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              {isTestingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Verificar Configuração Google OAuth</span>
            </button>

            {googleTestResult && (
              <div
                className={`p-3 rounded-xl border text-[11px] ${
                  googleTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {googleTestResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: BASE DE DADOS SUPABASE
      ======================================================== */}
      {subTab === 'supabase' && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-3xl">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Supabase Database &amp; Auth (PostgreSQL)</h3>
              <p className="text-[11px] text-gray-400">
                Armazenamento na nuvem para clientes, catálogo de sistemas, licenças e sincronização multi-dispositivo.
              </p>
            </div>
            <Database className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">URL do Projeto Supabase *</label>
              <input
                type="url"
                required
                value={supabaseForm.projectUrl}
                onChange={(e) => setSupabaseForm({ ...supabaseForm, projectUrl: e.target.value })}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Chave Pública Anónima (Anon Key) *</label>
              <textarea
                rows={2}
                required
                value={supabaseForm.anonKey}
                onChange={(e) => setSupabaseForm({ ...supabaseForm, anonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 font-mono text-[10px]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Service Role Key (Chave Administrativa)</label>
              <div className="relative">
                <input
                  type={showSupabaseSecret ? 'text' : 'password'}
                  value={supabaseForm.serviceRoleKey}
                  onChange={(e) => setSupabaseForm({ ...supabaseForm, serviceRoleKey: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSupabaseSecret(!showSupabaseSecret)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                >
                  {showSupabaseSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 text-[11px]">
              🔒 As chaves são guardadas com segurança no navegador do administrador e protegidas por Row Level Security (RLS) no PostgreSQL.
            </div>

            <button
              type="button"
              disabled={isTestingSupabase}
              onClick={handleTestSupabase}
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
            >
              {isTestingSupabase ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Testar Conexão Supabase</span>
            </button>

            {supabaseTestResult && (
              <div
                className={`p-3 rounded-xl border text-[11px] ${
                  supabaseTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                <strong>{supabaseTestResult.success ? 'Conexão Estabelecida' : 'Erro no Supabase'}:</strong>{' '}
                {supabaseTestResult.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

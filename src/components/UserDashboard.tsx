import React, { useState } from 'react';
import { SystemProduct, Order } from '../types';
import { formatMZN } from '../utils/pricing';
import { useAuth } from '../context/AuthContext';
import { saveInvoiceToDrive, sendReceiptViaGmail } from '../services/workspace';
import {
  Key,
  Download,
  Heart,
  ShoppingBag,
  ExternalLink,
  HardDrive,
  Mail,
  User,
  CheckCircle,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

interface UserDashboardProps {
  systems: SystemProduct[];
  onOpenDemo: (system: SystemProduct) => void;
  onClose: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  systems,
  onOpenDemo,
  onClose,
}) => {
  const { user, orders, favoriteSystemIds, googleAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'licenses' | 'favorites' | 'history'>('licenses');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [sendingOrderId, setSendingOrderId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const myOrders = orders.filter((o) => !user || o.userId === user.id || o.userEmail === user.email);
  const favoriteSystems = systems.filter((s) => favoriteSystemIds.includes(s.id));

  // Flatten all purchased license items
  const myLicenses = myOrders.flatMap((ord) =>
    ord.items.map((item) => ({
      ...item,
      orderNumber: ord.orderNumber,
      orderDate: ord.createdAt,
      paymentMethod: ord.paymentMethod,
    }))
  );

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveOrderToDrive = async (order: Order) => {
    if (!googleAccessToken) {
      alert('Inicie sessão com o Google para guardar diretamente no Google Drive.');
      return;
    }
    setSavingOrderId(order.id);
    try {
      await saveInvoiceToDrive(googleAccessToken, order);
      setNotification(`Fatura do pedido ${order.orderNumber} guardada no seu Google Drive com sucesso!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar no Google Drive.');
    } finally {
      setSavingOrderId(null);
    }
  };

  const handleSendOrderToGmail = async (order: Order) => {
    if (!googleAccessToken) {
      alert('Inicie sessão com o Google para enviar pelo Gmail.');
      return;
    }
    setSendingOrderId(order.id);
    try {
      await sendReceiptViaGmail(googleAccessToken, order, user?.email || order.userEmail);
      setNotification(`Comprovativo e licenças enviadas para ${user?.email || order.userEmail}!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar por Gmail.');
    } finally {
      setSendingOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* User Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl shrink-0 border border-blue-100">
            {user?.name?.charAt(0) || <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user?.name || 'Cliente TechVisions'}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Cliente Ativo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.email} • {user?.phone || '+258 84 000 0000'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Voltar ao Catálogo
          </button>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'licenses'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Meus Softwares &amp; Licenças ({myLicenses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Sistemas Guardados ({favoriteSystems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Histórico de Faturas ({myOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Licenses */}
      {activeTab === 'licenses' && (
        <div>
          {myLicenses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm text-xs text-gray-500">
              <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-sm">Nenhuma licença ativa</h3>
              <p className="text-gray-400 mt-1 max-w-sm mx-auto">
                Adquira um dos sistemas da TechVisions com M-Pesa, E-Mola ou Visa para receber a sua chave de ativação permanente e links de download aqui.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Ver Catálogo de Sistemas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLicenses.map((lic, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {lic.category}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 mt-1">{lic.title}</h3>
                      <p className="text-[11px] text-gray-400">
                        Pedido {lic.orderNumber} • {new Date(lic.orderDate).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      Vitalícia
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                      Chave de Ativação do Software:
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs font-bold text-blue-900">{lic.licenseKey}</code>
                      <button
                        onClick={() => handleCopy(lic.licenseKey)}
                        className="text-gray-500 hover:text-blue-600 p-1 rounded"
                        title="Copiar chave"
                      >
                        {copiedKey === lic.licenseKey ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={lic.downloadUrl}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descarregar APK / Setup</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteSystems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm text-xs text-gray-500">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-sm">Nenhum favorito guardado</h3>
              <p className="text-gray-400 mt-1">
                Clique no coração de qualquer sistema para guardar aqui para acesso rápido.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favoriteSystems.map((sys) => (
                <div key={sys.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <img src={sys.imageUrl} alt={sys.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                    <span className="text-[10px] font-bold text-blue-600">{sys.category}</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-1 line-clamp-1">{sys.title}</h4>
                    <p className="text-base font-black text-blue-950 mt-1">{formatMZN(sys.price)}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <button
                      onClick={() => onOpenDemo(sys)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                    >
                      <span>Testar Demonstração</span>
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History & Invoices */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          {myOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Nenhuma compra registrada na sua conta.
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl border border-gray-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 text-sm">{ord.orderNumber}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {ord.paymentStatus}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Data: {new Date(ord.createdAt).toLocaleString('pt-MZ')} • Pagamento: {ord.paymentMethod} (Ref: {ord.transactionRef})
                    </p>
                    <p className="text-gray-700 font-semibold mt-1">
                      Artigos: {ord.items.map((i) => i.title).join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-base font-black text-blue-950">{formatMZN(ord.totalAmount)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveOrderToDrive(ord)}
                        disabled={savingOrderId === ord.id}
                        className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-blue-50 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                        title="Guardar no Google Drive"
                      >
                        {savingOrderId === ord.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                        ) : (
                          <HardDrive className="w-3 h-3 text-blue-600" />
                        )}
                        <span>Google Drive</span>
                      </button>

                      <button
                        onClick={() => handleSendOrderToGmail(ord)}
                        disabled={sendingOrderId === ord.id}
                        className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-blue-50 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                        title="Enviar comprovativo por Gmail"
                      >
                        {sendingOrderId === ord.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                        ) : (
                          <Mail className="w-3 h-3 text-blue-600" />
                        )}
                        <span>Gmail</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

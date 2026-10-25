import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, Order, OrderItem } from '../types';
import { formatMZN, validateMozPhone, generateLicenseKey, generateOrderNumber } from '../utils/pricing';
import { saveInvoiceToDrive, sendReceiptViaGmail } from '../services/workspace';
import {
  X,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Mail,
  HardDrive,
  Printer,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    totalAmount,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();

  const { user, addOrder, googleAccessToken } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MPESA');
  const [phone, setPhone] = useState(user?.phone || '84');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Google Workspace sync states
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [driveResult, setDriveResult] = useState<string | null>(null);
  const [gmailResult, setGmailResult] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    // Phone validation for M-Pesa / E-Mola
    if (paymentMethod === 'MPESA' || paymentMethod === 'EMOLA') {
      const validation = validateMozPhone(phone);
      if (!validation.isValid) {
        setPhoneError(validation.error || 'Número de telefone inválido.');
        return;
      }
      if (paymentMethod === 'MPESA' && validation.carrier !== 'Vodacom') {
        setPhoneError('Para M-Pesa, o número deve ser Vodacom (iniciar com 84 ou 85).');
        return;
      }
      if (paymentMethod === 'EMOLA' && validation.carrier !== 'Movitel') {
        setPhoneError('Para E-Mola, o número deve ser Movitel (iniciar com 86 ou 87).');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Call server backend checkout endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          amount: totalAmount,
          phoneNumber: phone,
          cardNumber: paymentMethod === 'VISA' ? cardNumber.slice(-4) : undefined,
          items: items.map((i) => i.id),
          userName: user?.name,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar o pagamento.');
      }

      // Generate order items with unique license keys and instant download links
      const orderItems: OrderItem[] = items.map((item) => ({
        systemId: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        licenseKey: generateLicenseKey(`TV-${item.category.slice(0, 3).toUpperCase()}`),
        downloadUrl: `https://download.techvisions.co.mz/releases/${item.id}-v2.4-setup.zip`,
      }));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        userId: user?.id || 'guest',
        userName: user?.name || 'Cliente TechVisions',
        userEmail: user?.email || 'cliente@techvisions.co.mz',
        userPhone: phone,
        items: orderItems,
        totalAmount,
        paymentMethod,
        paymentStatus: 'SUCCESS',
        transactionRef: data.transactionRef,
        createdAt: new Date().toISOString(),
      };

      addOrder(newOrder);
      setCompletedOrder(newOrder);
      clearCart();

      // Attempt automatic Google Workspace sync if user signed in with Google
      if (googleAccessToken) {
        try {
          await saveInvoiceToDrive(googleAccessToken, newOrder);
          newOrder.googleDriveSynced = true;
          setDriveResult('Fatura guardada no seu Google Drive com sucesso!');
        } catch (driveErr) {
          console.warn('Google Drive sync:', driveErr);
        }

        try {
          if (newOrder.userEmail) {
            await sendReceiptViaGmail(googleAccessToken, newOrder, newOrder.userEmail);
            newOrder.gmailReceiptSent = true;
            setGmailResult('Comprovativo e licenças enviadas para o seu Gmail!');
          }
        } catch (gmailErr) {
          console.warn('Gmail sync:', gmailErr);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Erro durante a comunicação com o gateway de pagamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualDriveSave = async () => {
    if (!completedOrder || !googleAccessToken) {
      alert('Para guardar no Google Drive, inicie sessão com a sua conta Google.');
      return;
    }
    setIsSavingToDrive(true);
    try {
      const res = await saveInvoiceToDrive(googleAccessToken, completedOrder);
      setDriveResult('Fatura guardada com sucesso no seu Google Drive!');
    } catch (err: any) {
      alert(err.message || 'Falha ao guardar no Google Drive.');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleManualGmailSend = async () => {
    if (!completedOrder || !googleAccessToken) {
      alert('Para enviar pelo Gmail, inicie sessão com a sua conta Google.');
      return;
    }
    setIsSendingGmail(true);
    try {
      await sendReceiptViaGmail(googleAccessToken, completedOrder, completedOrder.userEmail);
      setGmailResult(`Recibo enviado para ${completedOrder.userEmail} com sucesso!`);
    } catch (err: any) {
      alert(err.message || 'Falha ao enviar recibo por email.');
    } finally {
      setIsSendingGmail(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setDriveResult(null);
    setGmailResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fechar checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Payment Success State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Pagamento Concluído com Sucesso
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                Obrigado pelo seu Pedido!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ref. da Transação: <span className="font-mono font-bold text-gray-800">{completedOrder.transactionRef}</span>
              </p>
            </div>

            {/* License details box */}
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-gray-700">Nº do Pedido: {completedOrder.orderNumber}</span>
                <span className="font-extrabold text-blue-900">{formatMZN(completedOrder.totalAmount)}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase block mb-1">
                  Chaves de Licença e Acesso:
                </span>
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-100 mb-2">
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Licença: <span className="font-mono font-semibold text-blue-600">{item.licenseKey}</span>
                    </p>
                    <a
                      href={item.downloadUrl}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold flex items-center gap-1 mt-1"
                    >
                      <span>Descarregar Pacote de Instalação</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Workspace Integrations Row */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left space-y-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-blue-600" />
                Integração Google Workspace (Drive &amp; Gmail)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleManualDriveSave}
                  disabled={isSavingToDrive}
                  className="p-2.5 bg-white border border-blue-200 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  {isSavingToDrive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Guardar no Google Drive</span>
                </button>

                <button
                  onClick={handleManualGmailSend}
                  disabled={isSendingGmail}
                  className="p-2.5 bg-white border border-blue-200 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  {isSendingGmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>Enviar Recibo por Gmail</span>
                </button>
              </div>

              {driveResult && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {driveResult}
                </p>
              )}
              {gmailResult && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {gmailResult}
                </p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
            >
              Concluir e Voltar ao Início
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Caixa Rápido TechVisions
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                Finalizar Pagamento
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Total do Pedido: <span className="font-extrabold text-blue-950 text-base">{formatMZN(totalAmount)}</span>
              </p>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Methods Tabs */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Escolha o método de pagamento em Moçambique:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('MPESA');
                      setPhoneError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'MPESA'
                        ? 'border-red-600 bg-red-50/80 text-red-600 shadow-sm font-bold ring-2 ring-red-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <span className="text-xs">M-Pesa</span>
                    <span className="text-[10px] text-gray-400">84 / 85</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('EMOLA');
                      setPhoneError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'EMOLA'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-700 shadow-sm font-bold ring-2 ring-amber-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">E-Mola</span>
                    <span className="text-[10px] text-gray-400">86 / 87</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('VISA');
                      setPhoneError('');
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'VISA'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm font-bold ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Cartão Visa</span>
                    <span className="text-[10px] text-gray-400">Nacional / Int.</span>
                  </button>
                </div>
              </div>

              {/* Mobile Wallet Fields */}
              {paymentMethod === 'MPESA' || paymentMethod === 'EMOLA' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Número de Celular {paymentMethod === 'MPESA' ? 'M-Pesa (Vodacom 84/85)' : 'E-Mola (Movitel 86/87)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">
                      +258
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder={paymentMethod === 'MPESA' ? '84 123 4567' : '86 123 4567'}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError('');
                      }}
                      className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {phoneError}
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      Irá receber um prompt USSD instantâneo no telemóvel para inserir o seu código PIN.
                    </p>
                  )}
                </div>
              ) : (
                /* Card Fields */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: ARINO EUGENIO"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Número do Cartão Visa / Mastercard
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Código CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A aguardar confirmação no telemóvel...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Pagamento ({formatMZN(totalAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Emissão instantânea de chaves de licença e download após aprovação</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

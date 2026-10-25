import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order } from '../types';
import { formatMZN } from '../utils/pricing';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token storage (NEVER in localStorage/sessionStorage as required)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Falha ao obter o token de acesso do Google OAuth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro de autenticação Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Save TechVisions Invoice / License Document to Google Drive (with permission)
 */
export async function saveInvoiceToDrive(accessToken: string, order: Order): Promise<{ fileId: string; webViewLink?: string }> {
  const content = `
=====================================================
            TECHVISIONS - RECIBO DE COMPRA
         Soluções Web & Mobile para Moçambique
=====================================================
Nº do Pedido: ${order.orderNumber}
Data: ${new Date(order.createdAt).toLocaleString('pt-MZ')}
Cliente: ${order.userName} (${order.userEmail})
Telemóvel: ${order.userPhone}
Método de Pagamento: ${order.paymentMethod}
Referência de Pagamento: ${order.transactionRef}
Estado: ${order.paymentStatus}
-----------------------------------------------------
SISTEMAS E LICENÇAS ADQUIRIDAS:
-----------------------------------------------------
${order.items.map((item, idx) => `
${idx + 1}. ${item.title} [${item.category}]
   Preço: ${formatMZN(item.price)}
   Chave de Licença: ${item.licenseKey}
   Download / Acesso: ${item.downloadUrl}
`).join('\n')}
-----------------------------------------------------
TOTAL PAGO: ${formatMZN(order.totalAmount)}
=====================================================
Suporte Técnico TechVisions Moçambique:
Email: comercial@techvisions.co.mz
Telemóvel: (+258) 84 900 1234 / 86 900 1234
Maputo & Matola - Moçambique
=====================================================
`;

  const metadata = {
    name: `TechVisions_Fatura_${order.orderNumber}.txt`,
    mimeType: 'text/plain',
    description: `Fatura e licenças de software da TechVisions para o pedido ${order.orderNumber}`,
  };

  const boundary = 'foo_bar_baz';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao guardar ficheiro no Google Drive');
  }

  const data = await response.json();
  return { fileId: data.id, webViewLink: data.webViewLink };
}

/**
 * Send purchase receipt email via Gmail API
 */
export async function sendReceiptViaGmail(
  accessToken: string,
  order: Order,
  recipientEmail: string
): Promise<{ messageId: string }> {
  const subject = `Recibo e Licenças do Pedido ${order.orderNumber} - TechVisions Moçambique`;
  const bodyText = `
Olá ${order.userName},

Agradecemos pela sua confiança na TechVisions! O seu pedido foi aprovado com sucesso.

Detalhes da Compra:
- Nº do Pedido: ${order.orderNumber}
- Método: ${order.paymentMethod} (Ref: ${order.transactionRef})
- Total: ${formatMZN(order.totalAmount)}

Sistemas Adquiridos:
${order.items.map(item => `* ${item.title}: Licença ${item.licenseKey} (Acesso: ${item.downloadUrl})`).join('\n')}

Se precisar de auxílio na instalação no seu computador ou telemóvel, entre em contacto com a nossa equipa de suporte técnico.

Com os melhores cumprimentos,
Equipa TechVisions Moçambique
Maputo, Moçambique
`;

  // Encode RFC 2822 email format in base64url
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${recipientEmail}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText,
  ];

  const emailRaw = emailLines.join('\r\n');
  const base64UrlEmail = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64UrlEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Erro ao enviar email pelo Gmail');
  }

  const data = await response.json();
  return { messageId: data.id };
}

/**
 * Export Sales Summary and Licensing Contracts to a new Google Spreadsheet
 */
export async function exportSalesToGoogleSheets(
  accessToken: string,
  orders: Order[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const dateStr = new Date().toISOString().slice(0, 10);
  const title = `TechVisions_Resumo_Vendas_Contratos_${dateStr}`;

  // 1. Create spreadsheet with 2 sheets
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        { properties: { title: 'Resumo_Vendas' } },
        { properties: { title: 'Contratos_Licencas' } },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Falha ao criar planilha no Google Sheets');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Populate Resumo_Vendas
  const salesHeaders = [
    'Nº Pedido',
    'Data / Hora',
    'Cliente',
    'Email',
    'Telemóvel (MZ)',
    'Método de Pagamento',
    'Referência de Pagamento',
    'Total (MZN)',
    'Estado',
  ];

  const salesRows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toLocaleString('pt-MZ'),
    o.userName,
    o.userEmail,
    o.userPhone,
    o.paymentMethod,
    o.transactionRef,
    o.totalAmount,
    o.paymentStatus,
  ]);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Resumo_Vendas!A1:I1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [salesHeaders, ...salesRows],
      }),
    }
  );

  // 3. Populate Contratos_Licencas
  const contractHeaders = [
    'Nº Pedido',
    'Data de Emissão',
    'Cliente Titular',
    'Email Cliente',
    'Sistema Adquirido',
    'Categoria Comercial',
    'Chave de Licença Vitalícia',
    'Preço da Licença (MZN)',
    'Link de Instalação e Setup',
  ];

  const contractRows: any[] = [];
  orders.forEach((o) => {
    o.items.forEach((item) => {
      contractRows.push([
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString('pt-MZ'),
        o.userName,
        o.userEmail,
        item.title,
        item.category,
        item.licenseKey,
        item.price,
        item.downloadUrl,
      ]);
    });
  });

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Contratos_Licencas!A1:I1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [contractHeaders, ...contractRows],
      }),
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}


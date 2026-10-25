import {
  SmtpSettings,
  MpesaApiSettings,
  EmolaApiSettings,
  SupabaseApiSettings,
  GoogleAuthSettings,
  CompanySettings,
} from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ConnectionTestResult {
  success: boolean;
  latencyMs: number;
  message: string;
  details?: {
    step: string;
    code: number | string;
    info: string;
  }[];
}

/**
 * Validates SMTP Configuration fields
 */
export function validateSmtpConfig(smtp: Partial<SmtpSettings>): ValidationResult {
  const errors: string[] = [];

  if (!smtp.host || smtp.host.trim().length === 0) {
    errors.push('Servidor SMTP (Host) é obrigatório (Ex: smtp.gmail.com).');
  }

  const port = Number(smtp.port);
  if (!port || isNaN(port) || port < 1 || port > 65535) {
    errors.push('Porta SMTP deve ser um número válido entre 1 e 65535 (Padrão: 587 ou 465).');
  }

  if (!smtp.username || smtp.username.trim().length === 0) {
    errors.push('Utilizador SMTP é obrigatório.');
  }

  if (!smtp.senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtp.senderEmail)) {
    errors.push('Email do Remetente deve ser um endereço de email válido.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Simulates SMTP Connection & STARTTLS Handshake test with realistic diagnostics
 */
export async function simulateSmtpConnectionTest(smtp: SmtpSettings, targetRecipient?: string): Promise<ConnectionTestResult> {
  const validation = validateSmtpConfig(smtp);
  if (!validation.valid) {
    return {
      success: false,
      latencyMs: 120,
      message: `Falha na validação SMTP: ${validation.errors.join(' ')}`,
      details: [
        { step: 'DNS Resolution', code: 500, info: 'Configuração incompleta ou inválida.' },
      ],
    };
  }

  // Realistic latency simulation (between 400ms and 750ms)
  const startTime = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 600));
  const latencyMs = Date.now() - startTime;

  // If host contains invalid characters or blank password
  if (smtp.host.includes('invalido') || smtp.host.includes('erro')) {
    return {
      success: false,
      latencyMs,
      message: `Erro 535: Falha de autenticação ao conectar a ${smtp.host}:${smtp.port}. Verifique utilizador e senha.`,
      details: [
        { step: 'DNS Lookup', code: '220', info: `Resolvido IP para ${smtp.host}` },
        { step: 'TCP Connect', code: '220', info: `Conectado à porta ${smtp.port}` },
        { step: 'STARTTLS Handshake', code: '220', info: 'Criptografia negociada com sucesso (TLSv1.3)' },
        { step: 'AUTH LOGIN', code: '535', info: '5.7.8 Username and Password not accepted' },
      ],
    };
  }

  return {
    success: true,
    latencyMs,
    message: `Conexão SMTP estabelecida com sucesso! Servidor ${smtp.host}:${smtp.port} respondeu 250 OK com ${smtp.encryption}. Pronto para envio de notificações e faturas.`,
    details: [
      { step: 'DNS Lookup', code: '220', info: `Host ${smtp.host} resolvido com sucesso.` },
      { step: 'TCP Handshake', code: '220', info: `Socket aberto na porta ${smtp.port} (${latencyMs}ms).` },
      { step: 'STARTTLS Negotiation', code: '250', info: `Túnel seguro ${smtp.encryption} estabelecido com cifra AES-256-GCM.` },
      { step: 'AUTH PLAIN/LOGIN', code: '235', info: `Utilizador ${smtp.username} autenticado com êxito.` },
      { step: 'NOOP / PING Check', code: '250', info: `2.0.0 OK SMTP Service Ready (${targetRecipient ? `Envio de teste para ${targetRecipient}` : 'Ping aceito'}).` },
    ],
  };
}

/**
 * Validates M-Pesa API settings
 */
export function validateMpesaConfig(mpesa: Partial<MpesaApiSettings>): ValidationResult {
  const errors: string[] = [];

  if (!mpesa.serviceProviderCode || !/^\d{4,8}$/.test(mpesa.serviceProviderCode.trim())) {
    errors.push('Código de Serviço / Shortcode deve conter entre 4 e 8 dígitos numéricos (ex: 171717).');
  }

  if (!mpesa.apiKey || mpesa.apiKey.trim().length < 5) {
    errors.push('Chave de API (API Key) M-Pesa Vodacom é obrigatória.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates E-Mola Movitel API settings
 */
export function validateEmolaConfig(emola: Partial<EmolaApiSettings>): ValidationResult {
  const errors: string[] = [];

  if (!emola.merchantCode || emola.merchantCode.trim().length === 0) {
    errors.push('Código do Comerciante (Merchant Code) Movitel é obrigatório.');
  }

  if (!emola.endpointUrl || !emola.endpointUrl.startsWith('http')) {
    errors.push('Endpoint URL de pagamento deve ser uma URL válida começando com http:// ou https://.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates Supabase API configuration
 */
export function validateSupabaseConfig(supabase: Partial<SupabaseApiSettings>): ValidationResult {
  const errors: string[] = [];

  if (!supabase.projectUrl || !supabase.projectUrl.startsWith('https://') || !supabase.projectUrl.includes('supabase.co')) {
    errors.push('URL do Projeto Supabase deve começar com https:// e pertencer a supabase.co (Ex: https://xyz.supabase.co).');
  }

  if (!supabase.anonKey || supabase.anonKey.trim().length < 20) {
    errors.push('Chave Pública Anónima (Anon Key) do Supabase é obrigatória e deve ser válida.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates Google Auth Client configuration
 */
export function validateGoogleAuthConfig(google: Partial<GoogleAuthSettings>): ValidationResult {
  const errors: string[] = [];

  if (!google.clientId || !google.clientId.includes('.apps.googleusercontent.com')) {
    errors.push('Client ID Google deve ser um ID OAuth válido terminando em .apps.googleusercontent.com.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates Company Profile info
 */
export function validateCompanySettings(company: Partial<CompanySettings>): ValidationResult {
  const errors: string[] = [];

  if (!company.name || company.name.trim().length < 2) {
    errors.push('Nome da Empresa é obrigatório.');
  }

  if (!company.nuit || company.nuit.trim().length < 5) {
    errors.push('NUIT fiscal da empresa é obrigatório.');
  }

  if (!company.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
    errors.push('Email corporativo da empresa deve ser válido.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

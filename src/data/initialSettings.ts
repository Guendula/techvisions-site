import { CompanySettings, SystemApiConfig } from '../types';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  name: 'TechVisions Moçambique',
  tagline: 'Sistemas Web & Mobile • Moçambique',
  logoUrl: '',
  nuit: '400982314',
  email: 'comercial@techvisions.co.mz',
  phone: '+258 84 312 9000',
  whatsapp: '+258 84 312 9000',
  address: 'Av. 24 de Julho, Edifício Maputo Business Tower, 7º Andar',
  city: 'Maputo',
  country: 'Moçambique',
  currency: 'MZN',
};

export const INITIAL_API_CONFIG: SystemApiConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'notificacoes@techvisions.co.mz',
    password: '••••••••••••',
    senderName: 'TechVisions MZ Licenciamento',
    senderEmail: 'notificacoes@techvisions.co.mz',
    encryption: 'TLS',
    status: 'untested',
    lastTestMessage: 'Nenhum teste de conexão realizado recentemente.',
  },
  mpesa: {
    apiKey: 'mz_mpesa_live_pk_9948271038a847',
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxM982...',
    serviceProviderCode: '171717',
    initiatorIdentifier: 'TECHVISIONS_C2B',
    securityCredential: '••••••••••••',
    environment: 'sandbox',
    status: 'untested',
  },
  emola: {
    merchantCode: 'MOV-MZ-88210',
    apiSecret: '••••••••••••',
    endpointUrl: 'https://api.movitel.co.mz/emola/v1/payment/c2b',
    environment: 'sandbox',
    status: 'untested',
  },
  googleAuth: {
    clientId: '982301928374-tvmozas.apps.googleusercontent.com',
    clientSecret: '••••••••••••',
    redirectUri: 'http://localhost:3000',
    authorizedOrigins: 'http://localhost:3000',
    status: 'untested',
  },
  supabase: {
    projectUrl: 'https://yaxjfnmowktyrvzqplaa.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheGpmbm1vd2t0eXJ2enFwbGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.fakeAnonKeyTechVisions',
    serviceRoleKey: '••••••••••••',
    status: 'untested',
  },
};

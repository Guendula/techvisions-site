import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateSmtpConfig,
  simulateSmtpConnectionTest,
  validateMpesaConfig,
  validateEmolaConfig,
  validateSupabaseConfig,
  validateGoogleAuthConfig,
  validateCompanySettings,
} from './settingsValidator';

describe('settingsValidator unit tests', () => {
  it('validates correct SMTP configuration', () => {
    const res = validateSmtpConfig({
      host: 'smtp.gmail.com',
      port: 587,
      username: 'admin@techvisions.co.mz',
      senderEmail: 'admin@techvisions.co.mz',
    });
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  it('rejects invalid SMTP port and missing host', () => {
    const res = validateSmtpConfig({
      host: '',
      port: 999999,
      username: '',
      senderEmail: 'invalido',
    });
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.length >= 3);
  });

  it('simulates SMTP connection success with step details and 250 OK', async () => {
    const res = await simulateSmtpConnectionTest({
      host: 'smtp.office365.com',
      port: 587,
      username: 'notificacoes@techvisions.co.mz',
      password: 'secretPassword123',
      senderName: 'TechVisions MZ',
      senderEmail: 'notificacoes@techvisions.co.mz',
      encryption: 'TLS',
      status: 'untested',
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.message.includes('250 OK'));
    assert.ok(res.details && res.details.length >= 4);
  });

  it('simulates SMTP connection failure on invalid host', async () => {
    const res = await simulateSmtpConnectionTest({
      host: 'smtp.invalido.host',
      port: 587,
      username: 'usuario',
      password: '123',
      senderName: 'Test',
      senderEmail: 'test@host.mz',
      encryption: 'TLS',
      status: 'untested',
    });

    assert.strictEqual(res.success, false);
    assert.ok(res.message.includes('535'));
  });

  it('validates Vodacom M-Pesa credentials', () => {
    const valid = validateMpesaConfig({
      serviceProviderCode: '171717',
      apiKey: 'sec_live_mpesa_984128947192',
    });
    assert.strictEqual(valid.valid, true);

    const invalid = validateMpesaConfig({
      serviceProviderCode: 'ABC',
      apiKey: '',
    });
    assert.strictEqual(invalid.valid, false);
    assert.strictEqual(invalid.errors.length, 2);
  });

  it('validates Movitel E-Mola configuration', () => {
    const valid = validateEmolaConfig({
      merchantCode: 'MOV-8841',
      endpointUrl: 'https://api.movitel.co.mz/payment',
    });
    assert.strictEqual(valid.valid, true);

    const invalid = validateEmolaConfig({
      merchantCode: '',
      endpointUrl: 'ftp://api.movitel.co.mz',
    });
    assert.strictEqual(invalid.valid, false);
  });

  it('validates Supabase Project URL and Anon Key', () => {
    const valid = validateSupabaseConfig({
      projectUrl: 'https://yaxjfnmowktyrvzqplaa.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.12345678901234567890',
    });
    assert.strictEqual(valid.valid, true);

    const invalid = validateSupabaseConfig({
      projectUrl: 'http://localhost:5432',
      anonKey: 'curto',
    });
    assert.strictEqual(invalid.valid, false);
  });

  it('validates Google Auth Client ID format', () => {
    const valid = validateGoogleAuthConfig({
      clientId: '1234567890-abc.apps.googleusercontent.com',
    });
    assert.strictEqual(valid.valid, true);

    const invalid = validateGoogleAuthConfig({
      clientId: 'invalido-id',
    });
    assert.strictEqual(invalid.valid, false);
  });

  it('validates Company settings information', () => {
    const valid = validateCompanySettings({
      name: 'TechVisions MZ',
      nuit: '400123984',
      email: 'contacto@techvisions.co.mz',
    });
    assert.strictEqual(valid.valid, true);

    const invalid = validateCompanySettings({
      name: '',
      nuit: '12',
      email: 'invalido',
    });
    assert.strictEqual(invalid.valid, false);
    assert.strictEqual(invalid.errors.length, 3);
  });
});

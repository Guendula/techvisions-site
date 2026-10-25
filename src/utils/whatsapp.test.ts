import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  cleanMozPhoneForWhatsApp,
  buildWhatsAppChatUrl,
  WHATSAPP_QUICK_OPTIONS,
} from './whatsapp';

describe('whatsapp utility unit tests', () => {
  it('formats Mozambique phone numbers correctly for WhatsApp', () => {
    assert.strictEqual(cleanMozPhoneForWhatsApp('+258 84 312 9000'), '258843129000');
    assert.strictEqual(cleanMozPhoneForWhatsApp('843129000'), '258843129000');
    assert.strictEqual(cleanMozPhoneForWhatsApp('(258) 86 123 4567'), '258861234567');
    assert.strictEqual(cleanMozPhoneForWhatsApp('0843129000'), '258843129000');
  });

  it('builds a valid wa.me URL with encoded message', () => {
    const url = buildWhatsAppChatUrl('+258 84 312 9000', 'Olá TechVisions!');
    assert.ok(url.startsWith('https://wa.me/258843129000?text='));
    assert.ok(url.includes('Ol%C3%A1%20TechVisions!'));
  });

  it('contains expected quick options for all company offerings', () => {
    assert.ok(WHATSAPP_QUICK_OPTIONS.length >= 4);
    const ids = WHATSAPP_QUICK_OPTIONS.map((o) => o.id);
    assert.ok(ids.includes('geral'));
    assert.ok(ids.includes('cotacao-software'));
    assert.ok(ids.includes('material-escritorio'));
    assert.ok(ids.includes('servidores-email'));
    assert.ok(ids.includes('gestao-stock'));
  });
});

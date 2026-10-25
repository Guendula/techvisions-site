import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMZN,
  validateMozPhone,
  calculateOrderSummary,
  generateLicenseKey,
  generateOrderNumber,
} from './pricing';

test('formatMZN formats numbers properly', () => {
  const formatted = formatMZN(15000);
  assert.ok(formatted.includes('15') && (formatted.includes('MZN') || formatted.includes('MT')));
});

test('validateMozPhone identifies Vodacom 84/85 for M-Pesa', () => {
  const res84 = validateMozPhone('841234567');
  assert.equal(res84.isValid, true);
  assert.equal(res84.carrier, 'Vodacom');
  assert.deepEqual(res84.supportedMethods, ['MPESA']);
  assert.equal(res84.normalized, '+258841234567');

  const res85 = validateMozPhone('+258 85 987 6543');
  assert.equal(res85.isValid, true);
  assert.equal(res85.carrier, 'Vodacom');
  assert.deepEqual(res85.supportedMethods, ['MPESA']);
});

test('validateMozPhone identifies Movitel 86/87 for E-Mola', () => {
  const res86 = validateMozPhone('860001122');
  assert.equal(res86.isValid, true);
  assert.equal(res86.carrier, 'Movitel');
  assert.deepEqual(res86.supportedMethods, ['EMOLA']);

  const res87 = validateMozPhone('879998877');
  assert.equal(res87.isValid, true);
  assert.equal(res87.carrier, 'Movitel');
  assert.deepEqual(res87.supportedMethods, ['EMOLA']);
});

test('validateMozPhone rejects invalid lengths or prefixes', () => {
  const short = validateMozPhone('841234');
  assert.equal(short.isValid, false);
  assert.ok(short.error?.includes('9 dígitos'));

  const invalidPrefix = validateMozPhone('811234567');
  assert.equal(invalidPrefix.isValid, false);
});

test('calculateOrderSummary calculates totals with quantities and discounts', () => {
  const items = [
    { price: 10000, quantity: 1 },
    { price: 5000, quantity: 2 },
  ];
  const summary = calculateOrderSummary(items, 10);
  assert.equal(summary.subtotal, 20000);
  assert.equal(summary.discountAmount, 2000);
  assert.equal(summary.total, 18000);
  assert.equal(summary.itemCount, 3);
});

test('generateLicenseKey produces TV prefix and valid format', () => {
  const key = generateLicenseKey();
  assert.ok(key.startsWith('TV-'));
  const parts = key.split('-');
  assert.equal(parts.length, 4);
});

test('generateOrderNumber produces TV-MZ pattern', () => {
  const orderNum = generateOrderNumber();
  assert.ok(orderNum.startsWith('TV-MZ-'));
});

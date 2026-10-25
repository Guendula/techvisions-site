import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateCategory,
  countSystemsInCategory,
  reassignCategory,
} from './categories';
import { CategoryItem, SystemProduct } from '../types';

const mockCategories: CategoryItem[] = [
  { id: 'cat-1', name: 'Padaria', description: 'Padarias e fornos', order: 1 },
  { id: 'cat-2', name: 'Mercearia', description: 'Minimercados', order: 2 },
];

const mockSystems: SystemProduct[] = [
  {
    id: 'sys-1',
    title: 'Pão Quente POS',
    category: 'Padaria',
    price: 10000,
    description: 'Sistema',
    demoUrl: '',
    imageUrl: '',
    likesCount: 1,
    features: [],
    demoType: 'pos',
  },
  {
    id: 'sys-2',
    title: 'Bolo Doce Pro',
    category: 'Padaria',
    price: 15000,
    description: 'Sistema',
    demoUrl: '',
    imageUrl: '',
    likesCount: 1,
    features: [],
    demoType: 'bakery',
  },
  {
    id: 'sys-3',
    title: 'Mercearia Central',
    category: 'Mercearia',
    price: 12000,
    description: 'Sistema',
    demoUrl: '',
    imageUrl: '',
    likesCount: 1,
    features: [],
    demoType: 'pos',
  },
];

describe('categories unit tests', () => {
  it('validates a correct new category', () => {
    const res = validateCategory(
      { name: 'Farmácia', description: 'Medicamentos e receituário' },
      mockCategories
    );
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  it('rejects duplicate category name', () => {
    const res = validateCategory(
      { name: 'padaria', description: 'Outra padaria' },
      mockCategories
    );
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors[0].includes('Já existe uma categoria'));
  });

  it('allows saving category with same name when editing itself', () => {
    const res = validateCategory(
      { name: 'Padaria', description: 'Padarias, fornos e bolos' },
      mockCategories,
      'cat-1'
    );
    assert.strictEqual(res.valid, true);
  });

  it('rejects category with short name or short description', () => {
    const res = validateCategory({ name: 'A', description: '12' }, mockCategories);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.errors.length, 2);
  });

  it('counts systems assigned to a category correctly', () => {
    const countPadaria = countSystemsInCategory(mockSystems, 'Padaria');
    const countMercearia = countSystemsInCategory(mockSystems, 'Mercearia');
    const countEmpty = countSystemsInCategory(mockSystems, 'Ferragens');

    assert.strictEqual(countPadaria, 2);
    assert.strictEqual(countMercearia, 1);
    assert.strictEqual(countEmpty, 0);
  });

  it('reassigns systems from old category to new category', () => {
    const updated = reassignCategory(mockSystems, 'Padaria', 'Panificação & Confeitaria');
    assert.strictEqual(updated[0].category, 'Panificação & Confeitaria');
    assert.strictEqual(updated[1].category, 'Panificação & Confeitaria');
    assert.strictEqual(updated[2].category, 'Mercearia');
  });
});

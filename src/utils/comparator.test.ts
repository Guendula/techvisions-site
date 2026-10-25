import test from 'node:test';
import assert from 'node:assert/strict';
import { canAddToComparison, buildComparisonMatrix } from './comparator';
import { INITIAL_SYSTEMS } from '../data/initialSystems';

test('canAddToComparison allows up to 3 items', () => {
  const current = ['sys-1', 'sys-2'];
  const res = canAddToComparison(current, 'sys-3', 3);
  assert.equal(res.allowed, true);

  const full = ['sys-1', 'sys-2', 'sys-3'];
  const resFull = canAddToComparison(full, 'sys-4', 3);
  assert.equal(resFull.allowed, false);
  assert.ok(resFull.reason?.includes('máximo 3'));
});

test('canAddToComparison rejects duplicates', () => {
  const current = ['sys-1', 'sys-2'];
  const res = canAddToComparison(current, 'sys-1', 3);
  assert.equal(res.allowed, false);
  assert.ok(res.reason?.includes('já está selecionado'));
});

test('buildComparisonMatrix generates hardware and feature benchmark rows', () => {
  const sample = INITIAL_SYSTEMS.slice(0, 3);
  const matrix = buildComparisonMatrix(sample);
  assert.ok(matrix.length > 5);

  const hardwareRows = matrix.filter((r) => r.category === 'hardware');
  const featureRows = matrix.filter((r) => r.category === 'feature');
  assert.ok(hardwareRows.length > 0);
  assert.ok(featureRows.length > 0);

  // Each row has values for all 3 systems
  matrix.forEach((row) => {
    sample.forEach((sys) => {
      assert.notEqual(row.values[sys.id], undefined);
    });
  });
});

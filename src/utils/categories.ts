import { CategoryItem, SystemProduct } from '../types';

export interface CategoryValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates category data before saving
 */
export function validateCategory(
  category: Partial<CategoryItem>,
  existingCategories: CategoryItem[],
  editingId?: string | null
): CategoryValidationResult {
  const errors: string[] = [];

  const name = category.name?.trim() || '';
  if (name.length < 2) {
    errors.push('O nome da categoria deve ter pelo menos 2 caracteres.');
  }

  // Check duplicate name
  const isDuplicate = existingCategories.some(
    (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== editingId
  );
  if (isDuplicate) {
    errors.push(`Já existe uma categoria com o nome "${name}".`);
  }

  const description = category.description?.trim() || '';
  if (description.length < 5) {
    errors.push('A descrição da categoria deve ter pelo menos 5 caracteres.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Counts how many systems are assigned to a given category name
 */
export function countSystemsInCategory(systems: SystemProduct[], categoryName: string): number {
  return systems.filter((s) => s.category.toLowerCase() === categoryName.toLowerCase()).length;
}

/**
 * Reassigns systems from an old category name to a new category name
 */
export function reassignCategory(
  systems: SystemProduct[],
  oldCategoryName: string,
  newCategoryName: string
): SystemProduct[] {
  if (!oldCategoryName || !newCategoryName || oldCategoryName === newCategoryName) {
    return systems;
  }
  return systems.map((sys) => {
    if (sys.category.toLowerCase() === oldCategoryName.toLowerCase()) {
      return { ...sys, category: newCategoryName };
    }
    return sys;
  });
}

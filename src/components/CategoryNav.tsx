'use client';

import React from 'react';
import type { Category } from '@/types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  language?: string;
}

export function CategoryNav({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryNavProps) {
  // Flatten categories for horizontal navigation
  const flattenCategories = (cats: Category[], depth = 0): (Category & { depth: number })[] => {
    const result: (Category & { depth: number })[] = [];
    for (const cat of cats) {
      result.push({ ...cat, depth });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, depth + 1));
      }
    }
    return result;
  };

  const flatCategories = flattenCategories(categories);

  if (flatCategories.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-16 z-30 border-b border-primary-300/20 bg-[#0d0a06]/95 backdrop-blur">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 p-4 min-w-max">
          {flatCategories.map((category) => {
            const isSelected = category._id === selectedCategoryId;
            const categoryName = category.name;

            return (
              <button
                key={category._id}
                onClick={() => onCategorySelect(category._id)}
                className={`
                  px-4 py-2 text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${category.depth > 0 ? 'ml-2' : ''}
                  ${
                    isSelected
                      ? 'bg-primary-400 text-black shadow-md branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]'
                      : 'border border-white/10 bg-white/[0.04] text-white/72 hover:border-primary-300/40 hover:text-white'
                  }
                `}
              >
                {category.depth > 0 && (
                  <span className="text-primary-300 mr-1">-</span>
                )}
                {categoryName}
                {category.productCount !== undefined && category.productCount > 0 && (
                  <span className={`ml-2 text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    ({category.productCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Vertical sidebar version
export function CategorySidebar({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryNavProps) {
  const renderCategory = (category: Category, depth = 0) => {
    const isSelected = category._id === selectedCategoryId;
    const categoryName = category.name;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category._id}>
        <button
          onClick={() => onCategorySelect(category._id)}
          className={`
            w-full text-left px-4 py-3 text-sm font-medium
            transition-all duration-200 flex items-center justify-between
            ${depth > 0 ? `pl-${4 + depth * 4}` : ''}
            ${
              isSelected
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
          `}
          style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
        >
          <span>{categoryName}</span>
          {category.productCount !== undefined && category.productCount > 0 && (
            <span className="text-xs text-gray-400">
              {category.productCount}
            </span>
          )}
        </button>
        {hasChildren && (
          <div>
            {(category.children || []).map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="py-4">
        <h2 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Categories
        </h2>
        {categories.map((category) => renderCategory(category))}
      </div>
    </aside>
  );
}

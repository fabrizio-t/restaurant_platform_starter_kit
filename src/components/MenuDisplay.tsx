'use client';

import React, { useState, useEffect } from 'react';
import { useGetPublicProductsQuery } from '@/features/public/publicApi';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { getLocalizedText, DEFAULT_LANGUAGE } from '@/lib/config';
import type { Category, Catalog, Product } from '@/types';

interface MenuDisplayProps {
  storeSlug: string;
  storeId: string;
  catalog: Catalog;
  language?: string;
  currency?: string;
}

export function MenuDisplay({
  storeSlug,
  storeId,
  catalog,
  language = DEFAULT_LANGUAGE,
  currency = 'EUR',
}: MenuDisplayProps) {
  const categories = catalog.categories || [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auto-select first category on mount
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      // Find first category with products or first leaf category
      const findFirstCategory = (cats: Category[]): string | undefined => {
        for (const cat of cats) {
          if (cat.productCount && cat.productCount > 0) {
            return cat._id;
          }
          if (cat.children && cat.children.length > 0) {
            const childId = findFirstCategory(cat.children);
            if (childId) return childId;
          }
          // Return category even if no product count (might have products)
          return cat._id;
        }
        return undefined;
      };
      
      const firstCategoryId = findFirstCategory(categories);
      if (firstCategoryId) {
        setSelectedCategoryId(firstCategoryId);
      }
    }
  }, [categories, selectedCategoryId]);

  // Fetch products for selected category
  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isFetching,
  } = useGetPublicProductsQuery(
    {
      storeSlug,
      categoryId: selectedCategoryId || '',
      language,
      limit: 50, // Fetch more products at once for better UX
    },
    { skip: !selectedCategoryId }
  );

  const products = productsResponse?.data?.products || [];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Scroll to top of products area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Find selected category name for display
  const findCategoryName = (cats: Category[], id: string): string => {
    for (const cat of cats) {
      if (cat._id === id) {
        return getLocalizedText(cat.name, language);
      }
      if (cat.children && cat.children.length > 0) {
        const name = findCategoryName(cat.children, id);
        if (name) return name;
      }
    }
    return '';
  };

  const selectedCategoryName = selectedCategoryId
    ? findCategoryName(categories, selectedCategoryId)
    : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
        language={language}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        {selectedCategoryName && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategoryName}
            </h2>
            {productsResponse?.data?.meta?.totalProducts !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {productsResponse.data.meta.totalProducts} items
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {(isLoadingProducts || isFetching) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoadingProducts && !isFetching && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                storeId={storeId}
                language={language}
                currency={currency}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingProducts && !isFetching && products.length === 0 && selectedCategoryId && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products in this category
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          storeId={storeId}
          language={language}
          currency={currency}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

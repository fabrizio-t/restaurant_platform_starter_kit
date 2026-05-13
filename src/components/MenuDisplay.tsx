'use client';

import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useGetProductsQuery } from '@/features/public/publicApi';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { ProductDetailsDialog } from './ProductDetailsDialog';
import { DEFAULT_LANGUAGE } from '@/lib/config';
import type { Category, Catalog, Product } from '@/types';

interface MenuDisplayProps {
  storeSlug: string;
  storeId: string;
  catalog: Catalog;
  language?: string;
  currency?: string;
  cartEnabled?: boolean;
}

function findFirstProductCategory(categories: Category[]): string | undefined {
  for (const category of categories) {
    if ((category.productCount || 0) > 0) return category._id;
    const child = findFirstProductCategory(category.children || []);
    if (child) return child;
  }

  return categories[0]?._id;
}

function findCategoryName(categories: Category[], id: string): string {
  for (const category of categories) {
    if (category._id === id) return category.name;
    const child = findCategoryName(category.children || [], id);
    if (child) return child;
  }

  return '';
}

export function MenuDisplay({
  storeSlug,
  storeId,
  catalog,
  language = DEFAULT_LANGUAGE,
  currency = 'EUR',
  cartEnabled = true,
}: MenuDisplayProps) {
  const categories = useMemo(() => catalog.categories || [], [catalog.categories]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(() =>
    findFirstProductCategory(catalog.categories || [])
  );
  const [cartProduct, setCartProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const search = searchInput.trim();
  const isGlobalSearch = search.length >= 2;

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isFetching,
  } = useGetProductsQuery(
    {
      storeSlug,
      categoryId: isGlobalSearch ? undefined : selectedCategoryId,
      catalogId: isGlobalSearch ? catalog._id : undefined,
      language,
      page,
      limit: 24,
      search: isGlobalSearch ? search : undefined,
    },
    {
      skip: !storeSlug || (!selectedCategoryId && !isGlobalSearch),
    }
  );

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;
  const selectedCategoryName = selectedCategoryId ? findCategoryName(categories, selectedCategoryId) : '';

  const handleCategorySelect = (categoryId: string) => {
    setSearchInput('');
    setSelectedCategoryId(categoryId);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 branded:bg-[var(--background)]">
      <CategoryNav
        categories={categories}
        selectedCategoryId={isGlobalSearch ? undefined : selectedCategoryId}
        onCategorySelect={handleCategorySelect}
        language={language}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white branded:text-[var(--foreground)]">
              {isGlobalSearch ? 'Search results' : selectedCategoryName || catalog.name}
            </h2>
            {meta?.totalItems !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 branded:text-[var(--muted-foreground)] mt-1">
                {meta.totalItems} items
              </p>
            )}
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
              placeholder="Search products"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 branded:bg-[var(--card)] branded:text-[var(--card-foreground)] branded:border-[var(--border)]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {(isLoadingProducts || isFetching) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse branded:bg-[var(--card)]"
              >
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoadingProducts && !isFetching && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  storeId={storeId}
                  language={language}
                  currency={currency}
                  cartEnabled={cartEnabled}
                  onAddToCartClick={setCartProduct}
                  onImageClick={setDetailsProduct}
                />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  disabled={!meta.hasPreviousPage}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {meta.currentPage} of {meta.totalPages}
                </span>
                <button
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!isLoadingProducts && !isFetching && products.length === 0 && (selectedCategoryId || isGlobalSearch) && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white branded:text-[var(--foreground)] mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 branded:text-[var(--muted-foreground)]">
              Try selecting a different category or search term.
            </p>
          </div>
        )}
      </div>

      {cartProduct && (
        <ProductModal
          product={cartProduct}
          storeId={storeId}
          language={language}
          currency={currency}
          cartEnabled={cartEnabled}
          isOpen={!!cartProduct}
          onClose={() => setCartProduct(null)}
        />
      )}

      {detailsProduct && (
        <ProductDetailsDialog
          product={detailsProduct}
          currency={currency}
          isOpen={!!detailsProduct}
          onClose={() => setDetailsProduct(null)}
        />
      )}
    </div>
  );
}

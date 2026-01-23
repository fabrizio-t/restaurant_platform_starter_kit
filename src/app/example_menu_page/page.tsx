'use client';

import React, { useEffect } from 'react';
import { useGetUnifiedStoreMenuQuery } from '@/features/public/publicApi';
import { useCart } from '@/features/cart/CartProvider';
import { Header, MenuDisplay, CartDrawer, CartButton } from '@/components';
import { STORE_SLUG, DEFAULT_LANGUAGE, getLocalizedText } from '@/lib/config';

export default function ExampleMenuPage() {
  const { initializeCart } = useCart();
  
  // Fetch store and menu data
  const {
    data: menuResponse,
    isLoading,
    isError,
    error,
  } = useGetUnifiedStoreMenuQuery({
    storeSlug: STORE_SLUG,
    language: DEFAULT_LANGUAGE,
  });

  const store = menuResponse?.data?.store;
  const catalogs = menuResponse?.data?.catalogs || [];
  const selectedCatalog = menuResponse?.data?.selectedCatalog || catalogs[0];

  // Initialize cart when store data is loaded
  useEffect(() => {
    if (store?._id) {
      initializeCart(store._id);
    }
  }, [store?._id, initializeCart]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Store Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn&apos;t find a store with the slug &quot;{STORE_SLUG}&quot;. Please check your configuration.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Make sure you have set the correct environment variable:
            </p>
            <code className="text-sm text-primary-600 dark:text-primary-400">
              NEXT_PUBLIC_STORE_SLUG=your-store-slug
            </code>
          </div>
        </div>
      </div>
    );
  }

  // No catalog available
  if (!selectedCatalog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header store={store} />
        <div className="flex items-center justify-center p-4 mt-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Menu Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This store doesn&apos;t have any active menus at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get currency from store settings
  const currency = store.currency || 'EUR';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header store={store} currency={currency} />

      {/* Menu Display */}
      <MenuDisplay
        storeSlug={STORE_SLUG}
        storeId={store._id}
        catalog={selectedCatalog}
        language={DEFAULT_LANGUAGE}
        currency={currency}
      />

      {/* Floating Cart Button (mobile) */}
      <div className="sm:hidden">
        <CartButton currency={currency} />
      </div>

      {/* Cart Drawer */}
      <CartDrawer currency={currency} />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getLocalizedText(store.name, DEFAULT_LANGUAGE)}
            </p>
            {store.location?.fullAddress && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {store.location.fullAddress}
              </p>
            )}
            {store.contacts?.phone && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {store.contacts.phone}
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Powered by MENUOF
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGetCatalogQuery, useGetStoreQuery } from '@/features/public/publicApi';
import { useCart } from '@/features/cart/CartProvider';
import { Header, MenuDisplay, CartDrawer, CartButton } from '@/components';
import { STORE_SLUG, DEFAULT_LANGUAGE, getImageUrl } from '@/lib/config';
import { applyStoreTheme } from '@/lib/theme-utils';

export default function ExampleMenuPage() {
  const { initializeCart } = useCart();
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | undefined>();

  const {
    data: storeResponse,
    isLoading: isStoreLoading,
    isError: isStoreError,
  } = useGetStoreQuery({
    storeSlug: STORE_SLUG,
    language: DEFAULT_LANGUAGE,
  });

  const store = storeResponse?.data;
  const listedCatalogs = useMemo(
    () => (store?.catalogs || []).filter((catalog) => catalog.listed !== false),
    [store?.catalogs]
  );

  useEffect(() => {
    if (store) {
      applyStoreTheme(store);
    }
  }, [store]);

  useEffect(() => {
    if (store?._id) {
      initializeCart(store._id);
    }
  }, [store?._id, initializeCart]);

  const activeCatalogId = selectedCatalogId || listedCatalogs[0]?._id;

  const {
    data: catalogResponse,
    isLoading: isCatalogLoading,
  } = useGetCatalogQuery(
    {
      storeSlug: STORE_SLUG,
      catalogId: activeCatalogId || '',
      language: DEFAULT_LANGUAGE,
    },
    { skip: !activeCatalogId }
  );

  const selectedCatalog = catalogResponse?.data;
  const currency = store?.currency || 'EUR';
  const ordersEnabled = store?.settings?.orders?.enabled !== false && selectedCatalog?.acceptOrders !== false;
  const isLoading = isStoreLoading || isCatalogLoading;

  if (isLoading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Store Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We could not find a store with the slug &quot;{STORE_SLUG}&quot;.
          </p>
          <code className="text-sm text-primary-600 dark:text-primary-400">
            Update LOCAL_CONFIG.storeSlug in src/lib/config.ts
          </code>
        </div>
      </div>
    );
  }

  if (listedCatalogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 branded:bg-[var(--background)]">
        <Header store={store} currency={currency} />
        <div className="flex items-center justify-center p-4 mt-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white branded:text-[var(--foreground)] mb-2">
              No Menu Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 branded:text-[var(--muted-foreground)]">
              This store does not have any active menus at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 branded:bg-[var(--background)]">
      <Header store={store} currency={currency} />

      {store.banner && (
        <div className="relative h-44 sm:h-64 bg-gray-200 dark:bg-gray-800">
          <Image
            src={getImageUrl(store.banner) || store.banner}
            alt={store.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-5 text-white">
            <h1 className="text-3xl font-bold">{store.name}</h1>
            {store.description && <p className="mt-1 max-w-2xl text-sm text-white/85">{store.description}</p>}
          </div>
        </div>
      )}

      {listedCatalogs.length > 1 && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 branded:bg-[var(--card)] branded:border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {listedCatalogs.map((catalog) => {
                const active = catalog._id === activeCatalogId;
                return (
                  <button
                    key={catalog._id}
                    onClick={() => setSelectedCatalogId(catalog._id)}
                    className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary-600 text-white branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {catalog.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedCatalog && (
        <MenuDisplay
          key={selectedCatalog._id}
          storeSlug={STORE_SLUG}
          storeId={store._id}
          catalog={selectedCatalog}
          language={DEFAULT_LANGUAGE}
          currency={currency}
          cartEnabled={ordersEnabled}
        />
      )}

      {ordersEnabled && (
        <>
          <div className="sm:hidden">
            <CartButton currency={currency} />
          </div>
          <CartDrawer currency={currency} />
        </>
      )}

      <footer className="bg-white dark:bg-gray-900 branded:bg-[var(--card)] border-t border-gray-200 dark:border-gray-700 branded:border-[var(--border)] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 branded:text-[var(--muted-foreground)]">
            {store.name}
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
      </footer>
    </div>
  );
}

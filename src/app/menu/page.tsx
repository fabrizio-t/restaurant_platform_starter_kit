'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import { useGetCatalogQuery, useGetStoreQuery } from '@/features/public/publicApi';
import { useCart } from '@/features/cart/CartProvider';
import { Header, MenuDisplay, CartDrawer, CartButton } from '@/components';
import { STORE_SLUG, DEFAULT_LANGUAGE, getImageUrl } from '@/lib/config';
import { applyStoreTheme } from '@/lib/theme-utils';

export default function MenuPage() {
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
  const banner = getImageUrl(store?.banner);

  if (isLoading && !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
          <p className="text-white/65">Caricamento menu...</p>
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
        <div className="max-w-md text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Menu non disponibile</h2>
          <p className="text-white/60">Non riusciamo a caricare il menu per lo slug &quot;{STORE_SLUG}&quot;.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header store={store} currency={currency} />

      <section className="relative overflow-hidden border-b border-primary-300/20 bg-[#100d08]">
        {banner && (
          <Image
            src={banner}
            alt={store.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/45" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary-200 hover:text-primary-100">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-300">Ritiro & consegna</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">Menu Raffaele di Stasio</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              Pizza fritta contemporanea, antipasti, montanarine campane, pizze special,
              primi, vini e dolci. Ordina online e ritira in Via S. Rocco a Lissone.
            </p>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-white/72 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-300" />
              {store.location?.fullAddress || 'Via S. Rocco, 46 - Lissone'}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-300" />
              {store.contacts?.phone || '+39 039 677 8225'}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-300" />
              Ritiro attivo negli orari di apertura
            </div>
          </div>
        </div>
      </section>

      {listedCatalogs.length > 1 && (
        <div className="border-b border-primary-300/20 bg-[#0d0a06]">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-max gap-2">
              {listedCatalogs.map((catalog) => {
                const active = catalog._id === activeCatalogId;
                return (
                  <button
                    key={catalog._id}
                    onClick={() => setSelectedCatalogId(catalog._id)}
                    className={`min-h-11 px-4 text-sm font-semibold transition ${
                      active
                        ? 'bg-primary-400 text-black'
                        : 'border border-white/10 bg-white/[0.04] text-white/70 hover:border-primary-300/40'
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

      <footer className="border-t border-primary-300/20 bg-black py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-white/52 sm:px-6 lg:px-8">
          <p className="font-medium text-white">{store.name}</p>
          <p className="mt-1">{store.location?.fullAddress}</p>
          <p className="mt-4">Powered by MENUOF</p>
        </div>
      </footer>
    </div>
  );
}

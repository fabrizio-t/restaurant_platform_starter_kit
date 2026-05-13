'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from './CartButton';
import { getImageUrl } from '@/lib/config';
import type { Store } from '@/types';

interface HeaderProps {
  store?: Store;
  language?: string;
  currency?: string;
}

export function Header({ store, currency = 'EUR' }: HeaderProps) {
  const storeName = store?.name || 'Restaurant';
  const storeLogo = getImageUrl(store?.logo);

  return (
    <header className="sticky top-0 z-40 border-b border-primary-300/20 bg-black/80 shadow-sm backdrop-blur branded:bg-[var(--header)] branded:text-[var(--header-foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {storeLogo ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-primary-300/30 bg-black">
                <Image
                  src={storeLogo}
                  alt={storeName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {storeName.charAt(0)}
                </span>
              </div>
            )}
            <h1 className="truncate text-base font-semibold uppercase tracking-[0.18em] text-white sm:text-lg branded:text-[var(--header-foreground)]">
              {storeName}
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/contatti" className="hidden text-sm font-medium text-white/72 hover:text-primary-200 sm:inline">
              Contatti
            </Link>
            <CartButton variant="inline" currency={currency} />
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { CartButton } from './CartButton';
import { getLocalizedText, getImageUrl, DEFAULT_LANGUAGE } from '@/lib/config';
import type { Store } from '@/types';

interface HeaderProps {
  store?: Store;
  language?: string;
  currency?: string;
}

export function Header({ store, language = DEFAULT_LANGUAGE, currency = 'EUR' }: HeaderProps) {
  const storeName = store ? getLocalizedText(store.name, language) : 'Restaurant';
  const storeLogo = getImageUrl(store?.logo);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            {storeLogo ? (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={storeLogo}
                  alt={storeName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {storeName.charAt(0)}
                </span>
              </div>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {storeName}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart button (inline version for header) */}
            <CartButton variant="inline" currency={currency} />
          </div>
        </div>
      </div>
    </header>
  );
}

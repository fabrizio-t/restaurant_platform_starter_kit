'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/features/cart/CartProvider';
import { formatCurrency } from '@/lib/config';

interface CartButtonProps {
  currency?: string;
  variant?: 'floating' | 'inline';
}

export function CartButton({ currency = 'EUR', variant = 'floating' }: CartButtonProps) {
  const { itemCount, subtotal, toggleCart } = useCart();

  if (variant === 'inline') {
    return (
      <button
        onClick={toggleCart}
        className="relative flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <>
            <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          </>
        )}
      </button>
    );
  }

  // Floating variant
  return (
    <button
      onClick={toggleCart}
      className={`
        fixed bottom-6 right-6 z-30
        flex items-center gap-3 px-6 py-4
        bg-primary-600 hover:bg-primary-700 text-white
        branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-200
        ${itemCount > 0 ? 'pr-8' : ''}
      `}
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      
      {itemCount > 0 && (
        <span className="font-semibold">
          {formatCurrency(subtotal, currency)}
        </span>
      )}
    </button>
  );
}

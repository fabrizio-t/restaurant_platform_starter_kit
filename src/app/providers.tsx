'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { CartProvider } from '@/features/cart/CartProvider';

interface ProvidersProps {
  children: React.ReactNode;
  storeId?: string;
}

export function Providers({ children, storeId }: ProvidersProps) {
  return (
    <Provider store={store}>
      <CartProvider storeId={storeId}>
        {children}
      </CartProvider>
    </Provider>
  );
}

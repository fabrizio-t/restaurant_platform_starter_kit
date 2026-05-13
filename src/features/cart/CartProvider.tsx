'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  useGetCartQuery,
  useCreateCartMutation,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
  useClearCartMutation,
} from './cartApi';
import { CART_SESSION_KEY, DEFAULT_LANGUAGE } from '@/lib/config';
import type { Cart, AddItemRequest, UpdateItemRequest } from '@/types';

function getInitialSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const urlSessionId = url.searchParams.get('sessionId');
  let storedSessionId = localStorage.getItem(CART_SESSION_KEY);

  if (urlSessionId) {
    storedSessionId = urlSessionId;
    localStorage.setItem(CART_SESSION_KEY, urlSessionId);
    url.searchParams.delete('sessionId');
    window.history.replaceState({}, '', url.toString());
  }

  if (!storedSessionId) {
    storedSessionId = uuidv4();
    localStorage.setItem(CART_SESSION_KEY, storedSessionId);
  }

  return storedSessionId;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  subtotal: number;
  currency: string;
  sessionId: string | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddItemRequest) => Promise<void>;
  updateItem: (itemId: string, updates: UpdateItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  initializeCart: (storeId: string) => Promise<void>;
  getProductQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  storeId?: string;
  language?: string;
}

export function CartProvider({
  children,
  storeId,
  language = DEFAULT_LANGUAGE,
}: CartProviderProps) {
  const [sessionId, setSessionId] = useState<string | null>(() => getInitialSessionId());
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(storeId);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // RTK Query hooks
  // Skip until we have BOTH sessionId AND storeId to prevent duplicate requests
  const {
    data: cartResponse,
    isLoading: isCartLoading,
    error: cartQueryError,
  } = useGetCartQuery(
    { sessionId: sessionId || '', storeId: currentStoreId, lang: language },
    { skip: !sessionId }
  );

  const [createCartMutation] = useCreateCartMutation();
  const [addItemMutation] = useAddItemToCartMutation();
  const [updateItemMutation] = useUpdateCartItemMutation();
  const [removeItemMutation] = useRemoveItemFromCartMutation();
  const [clearCartMutation] = useClearCartMutation();

  const cart = cartResponse?.data || null;

  useEffect(() => {
    const errorCode = (cartQueryError as { data?: { error?: { code?: string } } })?.data?.error?.code;
    if (errorCode === 'CART_EXPIRED') {
      const newSessionId = uuidv4();
      localStorage.setItem(CART_SESSION_KEY, newSessionId);
      window.setTimeout(() => setSessionId(newSessionId), 0);
    }
  }, [cartQueryError]);

  // Derived values
  const itemCount = useMemo(() => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart?.items]);

  const subtotal = useMemo(() => {
    return cart?.subtotal || 0;
  }, [cart?.subtotal]);

  const currency = cart?.storeCurrency || 'EUR';

  // Get the total quantity of a specific product in the cart
  const getProductQuantity = useCallback(
    (productId: string): number => {
      if (!cart?.items) return 0;
      return cart.items
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + item.quantity, 0);
    },
    [cart]
  );

  // Cart visibility handlers
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Initialize cart for a store - just sets the storeId, no POST request
  // Cart will be created lazily when adding the first item
  const initializeCart = useCallback(
    async (newStoreId: string) => {
      // Just set the store ID - the GET query will fetch existing cart if any
      // Cart creation happens lazily in addItem when needed
      setCurrentStoreId(newStoreId);
    },
    []
  );

  // Track if cart has been created to avoid duplicate creation attempts
  const cartCreatedRef = useRef(false);

  // Add item to cart (creates cart lazily if needed)
  const addItem = useCallback(
    async (item: AddItemRequest) => {
      if (!sessionId) {
        setError('Cart session not initialized');
        return;
      }

      const storeId = item.storeId || currentStoreId;

      try {
        setError(null);

        // Lazily create cart if it doesn't exist yet
        if (!cart && !cartCreatedRef.current && storeId) {
          cartCreatedRef.current = true;
          try {
            await createCartMutation({
              sessionId,
              storeId,
            }).unwrap();
          } catch {
            // Cart might already exist (409), continue to add item
          }
        }

        await addItemMutation({
          sessionId,
          item: {
            ...item,
            storeId,
          },
        }).unwrap();
        // Open cart drawer when item is added
        openCart();
      } catch (err: unknown) {
        const error = err as { data?: { error?: { message?: string }; message?: string } };
        setError(error?.data?.error?.message || error?.data?.message || 'Failed to add item to cart');
        throw err;
      }
    },
    [sessionId, currentStoreId, cart, addItemMutation, createCartMutation, openCart]
  );

  // Update cart item
  const updateItem = useCallback(
    async (itemId: string, updates: UpdateItemRequest) => {
      if (!sessionId) {
        setError('Cart session not initialized');
        return;
      }

      try {
        setError(null);
        await updateItemMutation({
          sessionId,
          itemId,
          updates,
        }).unwrap();
      } catch (err: unknown) {
        const error = err as { data?: { error?: { message?: string }; message?: string } };
        setError(error?.data?.error?.message || error?.data?.message || 'Failed to update item');
        throw err;
      }
    },
    [sessionId, updateItemMutation]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (itemId: string) => {
      if (!sessionId) {
        setError('Cart session not initialized');
        return;
      }

      try {
        setError(null);
        await removeItemMutation({
          sessionId,
          itemId,
        }).unwrap();
      } catch (err: unknown) {
        const error = err as { data?: { error?: { message?: string }; message?: string } };
        setError(error?.data?.error?.message || error?.data?.message || 'Failed to remove item');
        throw err;
      }
    },
    [sessionId, removeItemMutation]
  );

  // Clear entire cart
  const clearCartHandler = useCallback(async () => {
    if (!sessionId) {
      setError('Cart session not initialized');
      return;
    }

    try {
      setError(null);
      await clearCartMutation({ sessionId }).unwrap();
    } catch (err: unknown) {
      const error = err as { data?: { error?: { message?: string }; message?: string } };
      setError(error?.data?.error?.message || error?.data?.message || 'Failed to clear cart');
      throw err;
    }
  }, [sessionId, clearCartMutation]);

  const contextValue: CartContextType = useMemo(
    () => ({
      cart,
      isLoading: isCartLoading,
      error,
      itemCount,
      subtotal,
      currency,
      sessionId,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItem,
      removeItem,
      clearCart: clearCartHandler,
      initializeCart,
      getProductQuantity,
    }),
    [
      cart,
      isCartLoading,
      error,
      itemCount,
      subtotal,
      currency,
      sessionId,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateItem,
      removeItem,
      clearCartHandler,
      initializeCart,
      getProductQuantity,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

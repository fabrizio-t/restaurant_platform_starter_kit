'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  subtotal: number;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(storeId);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem(CART_SESSION_KEY);
      if (!storedSessionId) {
        storedSessionId = uuidv4();
        localStorage.setItem(CART_SESSION_KEY, storedSessionId);
      }
      setSessionId(storedSessionId);
    }
  }, []);

  // Update store ID when prop changes
  useEffect(() => {
    if (storeId) {
      setCurrentStoreId(storeId);
    }
  }, [storeId]);

  // RTK Query hooks
  const {
    data: cartResponse,
    isLoading: isCartLoading,
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

  // Derived values
  const itemCount = useMemo(() => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart?.items]);

  const subtotal = useMemo(() => {
    return cart?.subtotal || 0;
  }, [cart?.subtotal]);

  // Get the total quantity of a specific product in the cart
  const getProductQuantity = useCallback(
    (productId: string): number => {
      if (!cart?.items) return 0;
      return cart.items
        .filter((item) => item.productId === productId)
        .reduce((sum, item) => sum + item.quantity, 0);
    },
    [cart?.items]
  );

  // Cart visibility handlers
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Initialize cart for a store
  const initializeCart = useCallback(
    async (newStoreId: string) => {
      if (!sessionId) return;

      setCurrentStoreId(newStoreId);

      try {
        await createCartMutation({
          sessionId,
          storeId: newStoreId,
        }).unwrap();
      } catch (err: unknown) {
        // Cart might already exist, which is fine
        const error = err as { data?: { message?: string } };
        console.log('Cart initialization:', error?.data?.message || 'Cart already exists');
      }
    },
    [sessionId, createCartMutation]
  );

  // Add item to cart
  const addItem = useCallback(
    async (item: AddItemRequest) => {
      if (!sessionId) {
        setError('Cart session not initialized');
        return;
      }

      try {
        setError(null);
        await addItemMutation({
          sessionId,
          item: {
            ...item,
            storeId: item.storeId || currentStoreId,
          },
        }).unwrap();
        // Open cart drawer when item is added
        openCart();
      } catch (err: unknown) {
        const error = err as { data?: { message?: string } };
        setError(error?.data?.message || 'Failed to add item to cart');
        throw err;
      }
    },
    [sessionId, currentStoreId, addItemMutation, openCart]
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
        const error = err as { data?: { message?: string } };
        setError(error?.data?.message || 'Failed to update item');
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
        const error = err as { data?: { message?: string } };
        setError(error?.data?.message || 'Failed to remove item');
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
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'Failed to clear cart');
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

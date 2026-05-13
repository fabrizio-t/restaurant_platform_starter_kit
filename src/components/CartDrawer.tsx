'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/features/cart/CartProvider';
import { formatCurrency, getCheckoutUrl, getImageUrl } from '@/lib/config';

interface CartDrawerProps {
  currency?: string;
  language?: string;
}

export function CartDrawer({ currency = 'EUR' }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateItem,
    removeItem,
    itemCount,
    subtotal,
    sessionId,
    isLoading,
  } = useCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await updateItem(itemId, { quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    if (!sessionId) return;
    
    // Redirect to MENUOF platform checkout with session ID
    const checkoutUrl = getCheckoutUrl(sessionId);
    window.location.href = checkoutUrl;
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full transform bg-[#100d08] shadow-xl transition-transform sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary-300/20 p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-300" />
            <h2 className="text-lg font-bold text-white">
              Carrello
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-white/50">
                  ({itemCount} prodotti)
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 transition-colors hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : !cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-white/25 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Il carrello e vuoto
              </h3>
              <p className="text-white/50">
                Aggiungi un prodotto dal menu per iniziare.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item._id}
                  className="flex gap-4 border border-primary-300/14 bg-white/[0.04] p-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {getImageUrl(item.productImage) ? (
                      <Image
                        src={getImageUrl(item.productImage)!}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">
                      {item.productName}
                    </h4>
                    
                    {/* Selected variants */}
                    {item.selectedVariants?.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {item.selectedVariants.map((variant) => (
                          <p key={variant.variantId} className="text-xs text-gray-500 dark:text-gray-400">
                            {variant.variantName}: {variant.selectedItems.map((i) => i.productName).join(', ')}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Note */}
                    {item.note && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                        Note: {item.note}
                      </p>
                    )}

                    {/* Price and quantity */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.itemTotal, currency, 'it-IT')}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                        <span className="w-6 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart?.items && cart.items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-primary-300/20 bg-[#100d08] p-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/55">Subtotale</span>
              <span className="text-xl font-bold text-white">
                {formatCurrency(subtotal, currency, 'it-IT')}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="flex w-full items-center justify-center gap-2 bg-primary-400 py-4 font-bold text-black transition-colors hover:bg-primary-300"
            >
              <span>Procedi all&apos;ordine</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-center text-white/45 mt-3">
              Verrai reindirizzato per completare l&apos;ordine
            </p>
          </div>
        )}
      </div>
    </>
  );
}

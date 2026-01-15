'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/features/cart/CartProvider';
import { formatCurrency, getCheckoutUrl, getImageUrl, DEFAULT_LANGUAGE } from '@/lib/config';

interface CartDrawerProps {
  currency?: string;
  language?: string;
}

export function CartDrawer({ currency = 'EUR', language = DEFAULT_LANGUAGE }: CartDrawerProps) {
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
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({itemCount} items)
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
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
              <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item._id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
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
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
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
                        {formatCurrency(item.itemTotal, currency)}
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
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
              You will be redirected to complete your order
            </p>
          </div>
        )}
      </div>
    </>
  );
}

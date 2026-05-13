'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/config';
import { useCart } from '@/features/cart/CartProvider';
import type { Product, Variant, SelectedVariantRequest } from '@/types';

interface ProductModalProps {
  product: Product;
  storeId: string;
  language?: string;
  currency?: string;
  cartEnabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({
  product,
  storeId,
  currency = 'EUR',
  cartEnabled = true,
  isOpen,
  onClose,
}: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productName = product.name;
  const hasVariants = product.variants && product.variants.length > 0;

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNote('');
      setSelectedVariants({});
    }
  }, [isOpen, product._id]);

  // Handle variant selection
  const handleVariantSelect = (variant: Variant, itemId: string) => {
    setSelectedVariants((prev) => {
      const current = prev[variant._id] || [];
      
      if (variant.isMultipleChoice) {
        // Toggle selection
        if (current.includes(itemId)) {
          return {
            ...prev,
            [variant._id]: current.filter((id) => id !== itemId),
          };
        } else if (variant.maxChoice === 0 || current.length < variant.maxChoice) {
          return {
            ...prev,
            [variant._id]: [...current, itemId],
          };
        }
        return prev;
      } else {
        // Single selection
        return {
          ...prev,
          [variant._id]: [itemId],
        };
      }
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = product.price;
    
    if (hasVariants) {
      for (const variant of product.variants!) {
        const selectedItems = selectedVariants[variant._id] || [];
        for (const itemId of selectedItems) {
          const item = variant.items.find((i) => i._id === itemId);
          if (item) {
            total += item.price;
          }
        }
      }
    }
    
    return total * quantity;
  };

  // Check if all required variants are selected
  const isValid = () => {
    if (!hasVariants) return true;
    
    for (const variant of product.variants!) {
      const selected = selectedVariants[variant._id] || [];
      if (selected.length < variant.minChoice) {
        return false;
      }
    }
    return true;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);
    try {
      // Build selected variants for API
      const variantsForApi: SelectedVariantRequest[] = [];
      
      if (hasVariants) {
        for (const variant of product.variants!) {
          const selectedItems = selectedVariants[variant._id] || [];
          if (selectedItems.length > 0) {
            variantsForApi.push({
              variantId: variant._id,
              selectedItems: selectedItems.map((itemId) => ({
                productId: itemId,
                quantity: 1,
              })),
            });
          }
        }
      }

      await addItem({
        productId: product._id,
        quantity,
        note: note || undefined,
        storeId,
        selectedVariants: variantsForApi.length > 0 ? variantsForApi : undefined,
      });

      onClose();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative flex w-full max-h-[92vh] sm:max-w-lg flex-col bg-white dark:bg-gray-800 branded:bg-[var(--card)] sm:rounded-2xl shadow-xl transform transition-all overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 branded:border-[var(--border)] p-5">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white branded:text-[var(--card-foreground)]">
                {productName}
              </h2>
              <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-300 branded:text-[var(--muted-foreground)]">
                {hasVariants ? 'Customize your item' : 'Confirm quantity and notes'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-6">
            <div className="mb-5 rounded-xl bg-gray-50 dark:bg-gray-900/40 branded:bg-[var(--muted)] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 branded:text-[var(--muted-foreground)]">
                  Base price
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white branded:text-[var(--foreground)]">
                  {formatCurrency(product.price, currency)}
                </span>
              </div>
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-6 mb-6">
                {product.variants!.map((variant) => {
                  const variantName = variant.displayName || variant.name;
                  const selected = selectedVariants[variant._id] || [];
                  const isRequired = variant.minChoice > 0;

                  return (
                    <div key={variant._id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {variantName}
                          {isRequired && (
                            <span className="ml-2 text-xs text-red-500">Required</span>
                          )}
                        </h3>
                        {variant.isMultipleChoice && (
                          <span className="text-xs text-gray-500">
                            {variant.maxChoice > 0
                              ? `Select ${variant.minChoice}-${variant.maxChoice}`
                              : variant.minChoice > 0
                                ? `Select at least ${variant.minChoice}`
                                : 'Select any'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {variant.items.map((item) => {
                          const itemName = item.name;
                          const isSelected = selected.includes(item._id);

                          return (
                            <button
                              key={item._id}
                              onClick={() => handleVariantSelect(variant, item._id)}
                              className={`
                                w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all
                                ${
                                  isSelected
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${
                                      isSelected
                                        ? 'border-primary-500 bg-primary-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }
                                  `}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {itemName}
                                </span>
                              </div>
                              {item.price > 0 && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  +{formatCurrency(item.price, currency)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special instructions (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any allergies or special requests?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-5 border-t border-gray-200 dark:border-gray-700 branded:border-[var(--border)] bg-gray-50 dark:bg-gray-800/50 branded:bg-[var(--card)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
            {cartEnabled ? (
              <button
                onClick={handleAddToCart}
                disabled={!isValid() || isSubmitting}
                className={`
                  w-full min-h-12 py-3 rounded-xl font-semibold text-white transition-all
                  flex items-center justify-center gap-2
                  ${
                    isValid() && !isSubmitting
                      ? 'bg-primary-600 hover:bg-primary-700 branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]'
                      : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span>Add to cart</span>
                <span className="font-bold">{formatCurrency(calculateTotal(), currency)}</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-4 rounded-xl font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

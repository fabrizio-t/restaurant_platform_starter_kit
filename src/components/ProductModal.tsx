'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, AlertTriangle, Check } from 'lucide-react';
import { getLocalizedText, formatCurrency, getImageUrl, DEFAULT_LANGUAGE } from '@/lib/config';
import { useCart } from '@/features/cart/CartProvider';
import type { Product, Variant, SelectedVariantRequest } from '@/types';

interface ProductModalProps {
  product: Product;
  storeId: string;
  language?: string;
  currency?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({
  product,
  storeId,
  language = DEFAULT_LANGUAGE,
  currency = 'EUR',
  isOpen,
  onClose,
}: ProductModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productName = getLocalizedText(product.name, language);
  const productDescription = getLocalizedText(product.description, language);
  const imageUrl = getImageUrl(product.images?.[0]?.original || product.images?.[0]?.medium);
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
        } else if (current.length < variant.maxChoice) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-800 sm:rounded-2xl shadow-xl transform transition-all max-h-[90vh] overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          {imageUrl && (
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700">
              <Image
                src={imageUrl}
                alt={productName}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {productName}
            </h2>

            {productDescription && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {productDescription}
              </p>
            )}

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Allergens
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {product.allergens.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-6 mb-6">
                {product.variants!.map((variant) => {
                  const variantName = getLocalizedText(variant.displayName || variant.name, language);
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
                            Select {variant.minChoice}-{variant.maxChoice}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {variant.items.map((item) => {
                          const itemName = getLocalizedText(item.name, language);
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
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={handleAddToCart}
              disabled={!isValid() || isSubmitting}
              className={`
                w-full py-4 rounded-xl font-semibold text-white transition-all
                flex items-center justify-center gap-2
                ${
                  isValid() && !isSubmitting
                    ? 'bg-primary-600 hover:bg-primary-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span>Add to cart</span>
              <span className="font-bold">{formatCurrency(calculateTotal(), currency)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

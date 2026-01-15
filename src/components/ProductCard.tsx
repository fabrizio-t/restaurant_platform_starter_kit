'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import { getLocalizedText, formatCurrency, getImageUrl, DEFAULT_LANGUAGE } from '@/lib/config';
import { useCart } from '@/features/cart/CartProvider';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  storeId: string;
  language?: string;
  currency?: string;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  storeId,
  language = DEFAULT_LANGUAGE,
  currency = 'EUR',
  onProductClick,
}: ProductCardProps) {
  const { addItem, getProductQuantity } = useCart();
  const quantityInCart = getProductQuantity(product._id);

  const productName = getLocalizedText(product.name, language);
  const productDescription = getLocalizedText(product.description, language);
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get the first image with proper URL
  const imageUrl = getImageUrl(product.images?.[0]?.medium || product.images?.[0]?.original);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If product has variants, open the modal instead
    if (hasVariants && onProductClick) {
      onProductClick(product);
      return;
    }

    try {
      await addItem({
        productId: product._id,
        quantity: 1,
        storeId,
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        overflow-hidden transition-all duration-200
        ${onProductClick ? 'cursor-pointer hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600' : ''}
      `}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Quantity badge */}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {quantityInCart} in cart
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {productName}
        </h3>
        
        {productDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {productDescription}
          </p>
        )}

        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.allergens.slice(0, 3).join(', ')}
              {product.allergens.length > 3 && ` +${product.allergens.length - 3}`}
            </span>
          </div>
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price, currency)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {hasVariants ? 'Choose' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

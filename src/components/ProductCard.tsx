'use client';

import React from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { formatCurrency, getProductImageUrl } from '@/lib/config';
import { useCart } from '@/features/cart/CartProvider';
import { ModernAllergenIcons } from './ModernAllergenChips';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  storeId: string;
  language?: string;
  currency?: string;
  cartEnabled?: boolean;
  onAddToCartClick?: (product: Product) => void;
  onImageClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  currency = 'EUR',
  cartEnabled = true,
  onAddToCartClick,
  onImageClick,
}: ProductCardProps) {
  const { getProductQuantity } = useCart();
  const quantityInCart = getProductQuantity(product._id);

  const productName = product.name;
  const productDescription = product.description;
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get the first image with proper URL
  const imageUrl = getProductImageUrl(product.images?.[0], 'medium');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCartClick?.(product);
  };

  return (
    <div
      className={`
        bg-[#15110b] shadow-sm border border-primary-300/18 branded:bg-[var(--card)] branded:border-[var(--border)]
        overflow-hidden transition-all duration-200
        hover:shadow-md hover:border-primary-300/55
      `}
    >
      {/* Image */}
      <button
        type="button"
        onClick={() => onImageClick?.(product)}
        className="relative block w-full aspect-[4/3] bg-[#211a10] overflow-hidden text-left"
        aria-label={`View details for ${productName}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
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
          <div className="absolute top-2 right-2 bg-primary-400 text-black text-xs font-bold px-2 py-1">
            {quantityInCart} nel carrello
          </div>
        )}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
            <ImageIcon className="h-3.5 w-3.5" />
            {product.images.length}
          </span>
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">
          {productName}
        </h3>
        
        {productDescription && (
          <p className="text-sm text-white/58 mb-3 line-clamp-2">
            {productDescription}
          </p>
        )}

        {product.allergens && product.allergens.length > 0 && (
          <ModernAllergenIcons allergens={product.allergens} size={20} maxVisible={6} className="mb-3" />
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-200">
            {hasVariants ? `da ${formatCurrency(product.price, currency, 'it-IT')}` : formatCurrency(product.price, currency, 'it-IT')}
          </span>
          
          {cartEnabled && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-primary-400 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-primary-300 branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]"
            >
              <Plus className="w-4 h-4" />
              {hasVariants ? 'Scegli' : 'Aggiungi'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatCurrency, getProductImageUrl } from '@/lib/config';
import { ModernAllergenChips } from './ModernAllergenChips';
import type { Product } from '@/types';

interface ProductDetailsDialogProps {
  product: Product;
  currency?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsDialog({
  product,
  currency = 'EUR',
  isOpen,
  onClose,
}: ProductDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const imageUrl = getProductImageUrl(images[currentImageIndex], 'large');

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && hasMultipleImages) {
        setCurrentImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
      }
      if (event.key === 'ArrowRight' && hasMultipleImages) {
        setCurrentImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [hasMultipleImages, images.length, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close product details"
      />

      <div className="relative w-full max-w-4xl max-h-[94vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 branded:bg-[var(--card)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[94vh] overflow-y-auto">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No image
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((index) => (index === 0 ? images.length - 1 : index - 1))}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((index) => (index === images.length - 1 ? 0 : index + 1))}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto bg-black/90 p-3">
              {images.map((image, index) => {
                const thumb = getProductImageUrl(image, 'small');
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      index === currentImageIndex ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Image ${index + 1}`}
                  >
                    {thumb && <Image src={thumb} alt="" fill className="object-cover" />}
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white branded:text-[var(--card-foreground)]">
                {product.name}
              </h2>
              <span className="inline-flex w-fit rounded-xl bg-primary-600 px-4 py-2 text-xl font-bold text-white branded:bg-[var(--brand)] branded:text-[var(--brand-foreground)]">
                {formatCurrency(product.price, currency)}
              </span>
            </div>

            {product.description && (
              <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 branded:text-[var(--muted-foreground)]">
                {product.description}
              </p>
            )}

            {product.allergens?.length ? (
              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700 branded:border-[var(--border)]">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 branded:text-[var(--muted-foreground)]">
                  Allergens
                </h3>
                <ModernAllergenChips allergens={product.allergens} size="md" maxVisible={14} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

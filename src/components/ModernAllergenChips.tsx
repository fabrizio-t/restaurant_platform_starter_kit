'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Allergen } from '@/types';

function AllergenIcon({ allergen, size }: { allergen: Allergen; size: number }) {
  return (
    <Image
      src={`/allergen/${allergen.id}.png`}
      alt={allergen.name}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}

interface ModernAllergenChipsProps {
  allergens?: Allergen[];
  size?: 'sm' | 'md';
  maxVisible?: number;
  showNames?: boolean;
  variant?: 'default' | 'warning' | 'subtle';
  className?: string;
}

export function ModernAllergenChips({
  allergens,
  size = 'sm',
  maxVisible = 4,
  showNames = true,
  variant = 'default',
  className = '',
}: ModernAllergenChipsProps) {
  const [showAll, setShowAll] = useState(false);

  if (!allergens?.length) return null;

  const visibleAllergens = showAll ? allergens : allergens.slice(0, maxVisible);
  const hiddenCount = allergens.length - maxVisible;
  const hasMore = !showAll && hiddenCount > 0;

  const sizeConfig = {
    sm: {
      iconSize: 14,
      padding: 'px-1.5 py-0.5',
      text: 'text-xs',
      gap: 'gap-1',
      chipGap: 'gap-1',
    },
    md: {
      iconSize: 18,
      padding: 'px-2 py-1',
      text: 'text-sm',
      gap: 'gap-1.5',
      chipGap: 'gap-1.5',
    },
  };

  const variantConfig = {
    default: {
      chip: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50',
      text: 'text-amber-800 dark:text-amber-200',
      more: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300',
    },
    warning: {
      chip: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50',
      text: 'text-red-700 dark:text-red-300',
      more: 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400',
    },
    subtle: {
      chip: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      more: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400',
    },
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  return (
    <div className={`flex flex-wrap ${config.chipGap} ${className}`}>
      {visibleAllergens.map((allergen) => (
        <span
          key={`${allergen.id}-${allergen.name}`}
          className={`inline-flex items-center ${config.gap} ${config.padding} ${colors.chip} ${colors.text} ${config.text} font-medium rounded-full border transition-colors duration-150`}
          title={allergen.name}
        >
          <AllergenIcon allergen={allergen} size={config.iconSize} />
          {showNames && <span>{allergen.name}</span>}
        </span>
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={`inline-flex items-center ${config.padding} ${colors.more} ${config.text} font-medium rounded-full border hover:opacity-80 transition-all duration-150`}
        >
          +{hiddenCount} more
        </button>
      )}

      {showAll && allergens.length > maxVisible && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className={`inline-flex items-center ${config.padding} ${colors.more} ${config.text} font-medium rounded-full border hover:opacity-80 transition-all duration-150`}
        >
          Show less
        </button>
      )}
    </div>
  );
}

export function ModernAllergenIcons({
  allergens,
  size = 24,
  maxVisible = 5,
  className = '',
}: {
  allergens?: Allergen[];
  size?: number;
  maxVisible?: number;
  className?: string;
}) {
  if (!allergens?.length) return null;

  const visibleAllergens = allergens.slice(0, maxVisible);
  const hiddenCount = allergens.length - maxVisible;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {visibleAllergens.map((allergen) => (
        <span key={`${allergen.id}-${allergen.name}`} title={allergen.name}>
          <AllergenIcon allergen={allergen} size={size} />
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

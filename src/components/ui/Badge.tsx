import React from 'react';
import { useI18n } from '../../i18n/i18nContext.tsx';

export type BadgeVariant = 
  | 'featured' 
  | 'hotDeal' 
  | 'new' 
  | 'priceDrop' 
  | 'reserved' 
  | 'sold' 
  | 'verified';

export interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  label,
  className = '',
  size = 'md',
}) => {
  const { t } = useI18n();

  // Consistent styling tokens per PRD 13.3
  const variantStyles: Record<BadgeVariant, string> = {
    featured: 'bg-amber-100 text-amber-900 border-amber-300',
    hotDeal: 'bg-orange-100 text-orange-900 border-orange-300 font-semibold',
    new: 'bg-emerald-100 text-[#1F9D55] border-emerald-300',
    priceDrop: 'bg-blue-100 text-blue-900 border-blue-300',
    reserved: 'bg-gray-200 text-gray-800 border-gray-400',
    // SOLD tag: prominent #C8102E with white text
    sold: 'bg-[#C8102E] text-white border-[#C8102E] font-bold tracking-wider uppercase',
    verified: 'bg-emerald-50 text-[#1F9D55] border-emerald-300 font-medium',
  };

  const sizeStyles = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  const defaultText = t(`badges.${variant}`);
  const displayText = label || defaultText;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border shadow-2xs select-none transition-colors ${sizeStyles} ${variantStyles[variant]} ${className}`}
    >
      {displayText}
    </span>
  );
};

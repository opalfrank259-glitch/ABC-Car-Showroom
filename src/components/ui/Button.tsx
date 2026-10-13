import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles: accessible tap target (min 44px height for md/lg), focus ring, transitions
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'min-h-[38px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-base gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#14161C] text-white hover:bg-black active:bg-gray-900 focus-visible:ring-[#14161C]',
    secondary: 'bg-gray-100 text-[#14161C] hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400',
    outline: 'border border-gray-300 bg-white text-[#14161C] hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-400',
    ghost: 'bg-transparent text-[#14161C] hover:bg-black/5 active:bg-black/10 focus-visible:ring-gray-400',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20ba59] active:bg-[#1da850] shadow-sm focus-visible:ring-[#25D366]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

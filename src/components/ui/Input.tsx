import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', hasError = false, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute start-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full min-h-[44px] rounded-lg border bg-white px-3 py-2 text-sm text-[#14161C] placeholder:text-gray-400 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
            leftIcon ? 'ps-10' : ''
          } ${rightIcon ? 'pe-10' : ''} ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute end-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

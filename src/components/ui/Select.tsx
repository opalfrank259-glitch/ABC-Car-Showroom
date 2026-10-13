import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  hasError?: boolean;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', hasError = false, options, placeholder, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full min-h-[44px] appearance-none rounded-lg border bg-white ps-3 pe-10 py-2 text-sm text-[#14161C] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute end-3 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

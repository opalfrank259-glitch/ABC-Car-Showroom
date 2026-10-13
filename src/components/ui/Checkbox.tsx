import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, checked, disabled, id, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-start gap-3 min-h-[44px] py-1 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded border border-gray-300 bg-white peer-checked:bg-[#14161C] peer-checked:border-[#14161C] peer-focus-visible:ring-2 peer-focus-visible:ring-[#14161C] peer-focus-visible:ring-offset-2 transition-colors flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col text-sm">
            {label && <span className="font-medium text-[#14161C] leading-snug">{label}</span>}
            {description && <span className="text-xs text-gray-500 leading-normal mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

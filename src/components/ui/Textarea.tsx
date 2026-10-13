import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', hasError = false, disabled, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#14161C] placeholder:text-gray-400 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
          hasError
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-gray-300 focus:border-[#14161C] focus:ring-1 focus:ring-[#14161C]'
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

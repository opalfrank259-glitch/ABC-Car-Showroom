import React from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required = false,
  id,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#14161C] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-[#C8102E]" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <span className="text-xs text-gray-500">{hint}</span>
      )}
      {error && (
        <span role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Esc key listener and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal container
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthStyles} bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-10 focus:outline-none transition-all my-8`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div>
              {title && (
                <h3 id={titleId} className="text-base font-semibold text-[#14161C]">
                  {title}
                </h3>
              )}
              {description && (
                <p id={descId} className="text-xs text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#14161C] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 text-sm text-[#14161C]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

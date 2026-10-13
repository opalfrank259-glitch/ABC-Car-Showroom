import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      className={`bg-gray-200/80 animate-pulse ${variantStyles} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

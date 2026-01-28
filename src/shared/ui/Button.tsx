'use client';

import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-bold transition disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantStyles = {
    primary:
      'bg-[#10a6c1] text-white hover:bg-[#0d8fa8] disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-xl',
    secondary: 'bg-gray-900 text-white hover:opacity-90 disabled:bg-gray-300 dark:bg-gray-700 dark:disabled:bg-gray-600 rounded-2xl',
    outline:
      'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:disabled:bg-gray-800 rounded-xl',
    ghost: 'text-gray-400 hover:text-gray-900 disabled:opacity-0 dark:text-gray-400 dark:hover:text-gray-100',
  };

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const iconElement = icon && !isLoading && icon;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  );
}

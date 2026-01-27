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
      'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 shadow-lg shadow-indigo-100 rounded-xl',
    secondary: 'bg-gray-900 text-white hover:opacity-90 disabled:bg-gray-300 shadow-lg rounded-2xl',
    outline:
      'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 rounded-xl',
    ghost: 'text-gray-400 hover:text-gray-900 disabled:opacity-0',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-10 py-3 text-base',
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

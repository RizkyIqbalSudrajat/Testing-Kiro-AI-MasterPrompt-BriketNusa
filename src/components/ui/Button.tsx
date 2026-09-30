import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base sizing
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
  };

  // Color variants
  const variantStyles = {
    // Primary: gradient hijau daun kelapa (#16A34A) to emerald (#10B981)
    primary:
      'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-sm hover:shadow-md border border-emerald-500/20 active:scale-[0.98]',
    // Accent: oranye bara (#F97316) for CTA & highlights
    accent:
      'bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#FB923C] hover:to-[#F97316] text-white shadow-sm hover:shadow-md border border-orange-500/30 active:scale-[0.98]',
    // Secondary: cokelat tempurung (#6B4423) or warm slate
    secondary:
      'bg-[#6B4423] hover:bg-[#58371C] text-[#FAFAF7] shadow-sm hover:shadow-md border border-[#85552D]/30 active:scale-[0.98]',
    // Ghost: quiet transparent
    ghost:
      'bg-transparent hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300 active:scale-[0.98]',
    // Outline: subtle bordered
    outline:
      'bg-transparent hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 active:scale-[0.98]',
    // Danger: for cancel/reject
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-[0.98]',
  };

  const glowStyle =
    glow && variant === 'primary'
      ? 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)]'
      : glow && variant === 'accent'
      ? 'shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)]'
      : '';

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${glowStyle} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverLift?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glowBorder?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverLift = true,
  padding = 'lg',
  glowBorder = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  };

  const glowStyle = glowBorder
    ? 'shadow-[0_8px_32px_0_rgba(16,185,129,0.15)] dark:shadow-[0_8px_32px_0_rgba(16,185,129,0.1)]'
    : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]';

  return (
    <motion.div
      whileHover={hoverLift ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`relative overflow-hidden rounded-3xl bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl border border-white/80 dark:border-white/10 ${glowStyle} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {/* Subtle glass reflection highlight */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-2xl" />
      {children}
    </motion.div>
  );
};

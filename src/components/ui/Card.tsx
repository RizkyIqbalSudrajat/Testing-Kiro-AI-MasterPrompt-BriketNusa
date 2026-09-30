import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverLift?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = true,
  bordered = true,
  padding = 'lg',
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

  return (
    <motion.div
      whileHover={hoverLift ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`bg-white dark:bg-stone-900/90 rounded-3xl ${
        bordered ? 'border border-stone-200/80 dark:border-stone-800' : ''
      } shadow-xs hover:shadow-md transition-shadow duration-200 ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

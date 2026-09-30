import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  suffix?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, iconPosition = 'left', suffix, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-2xl transition-all">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 dark:text-stone-500">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full py-2.5 text-sm bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-2xl border text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
              icon && iconPosition === 'left' ? 'pl-10' : 'pl-3.5'
            } ${rightElement ? 'pr-11' : icon && iconPosition === 'right' ? 'pr-10' : suffix ? 'pr-12' : 'pr-3.5'} ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-stone-200 dark:border-stone-800'
            } ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
              {rightElement}
            </div>
          )}

          {suffix && !rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-stone-400 dark:text-stone-500 font-medium">
              {suffix}
            </div>
          )}

          {icon && iconPosition === 'right' && !rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400 dark:text-stone-500">
              {icon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

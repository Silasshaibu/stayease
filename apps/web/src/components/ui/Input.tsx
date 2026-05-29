'use client';
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          'rounded-lg border px-3 py-2 text-sm outline-none transition-all',
          'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  ),
);
Input.displayName = 'Input';

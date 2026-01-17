/**
 * Hotel PMS - Input Component
 * Reusable input field component
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// Input props extending HTML input attributes
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 * A styled input field with support for icons and error state
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, leftIcon, rightIcon, ...props }, ref) => {
    const hasError = error || !!errorMessage;
    
    // Wrapper for icon inputs
    if (leftIcon || rightIcon) {
      return (
        <div>
          <div className="relative">
            {/* Left icon */}
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {leftIcon}
              </div>
            )}
            
            {/* Input field */}
            <input
              type={type}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                hasError && 'border-destructive focus-visible:ring-destructive',
                className
              )}
              ref={ref}
              {...props}
            />
            
            {/* Right icon */}
            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
          {errorMessage && (
            <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      );
    }

    // Standard input without icons
    return (
      <div>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

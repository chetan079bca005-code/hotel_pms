/**
 * Hotel PMS - Button Component
 * Reusable button component with variants
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Button variants using CVA
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // Visual variants
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      },
      // Size variants
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
        iconSm: 'h-8 w-8',
        iconLg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Button props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loading?: boolean; // Alias for isLoading
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * A versatile button with multiple variants, sizes, and loading state
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Use Slot component when asChild is true (for composition with links, etc.)
    const Comp = asChild ? Slot : 'button';
    const showLoading = isLoading || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || showLoading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {/* Loading spinner */}
            {showLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            
            {/* Left icon */}
            {!showLoading && leftIcon && (
              <span className="mr-2" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            
            {/* Button content */}
            {children}
            
            {/* Right icon */}
            {rightIcon && (
              <span className="ml-2" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

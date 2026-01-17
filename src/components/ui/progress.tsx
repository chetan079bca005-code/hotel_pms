/**
 * Hotel PMS - Progress Component
 * Progress bar indicator using Radix UI
 */

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Progress bar variants
 */
const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-1',
        default: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Progress indicator variants
 */
const indicatorVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      destructive: 'bg-destructive',
      info: 'bg-blue-500',
      gradient: 'bg-gradient-to-r from-primary to-primary/50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Progress component props
 */
export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof indicatorVariants> {
  // Show percentage label
  showLabel?: boolean;
  // Custom label text
  label?: string;
  // Animate the progress bar
  animated?: boolean;
  // Indeterminate loading state
  indeterminate?: boolean;
}

/**
 * Progress bar component
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      size,
      variant,
      showLabel,
      label,
      animated,
      indeterminate,
      ...props
    },
    ref
  ) => (
    <div className="w-full">
      {/* Label and percentage */}
      {(showLabel || label) && (
        <div className="mb-1 flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showLabel && !indeterminate && (
            <span className="text-foreground font-medium">{value ?? 0}%</span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            indicatorVariants({ variant }),
            animated && 'transition-all duration-500 ease-in-out',
            indeterminate && 'animate-progress-indeterminate'
          )}
          style={
            indeterminate
              ? undefined
              : { transform: `translateX(-${100 - (value || 0)}%)` }
          }
        />
      </ProgressPrimitive.Root>
    </div>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants, indicatorVariants };

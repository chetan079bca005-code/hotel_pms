/**
 * Hotel PMS - Loading Spinner Component
 * Versatile loading spinner with multiple variants
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Spinner variants
 */
const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

/**
 * LoadingSpinner props
 */
export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  // Loading text to display
  text?: string;
  // Show full page overlay
  fullPage?: boolean;
  // Show with overlay background
  overlay?: boolean;
}

/**
 * LoadingSpinner component
 */
export function LoadingSpinner({
  className,
  size,
  text,
  fullPage = false,
  overlay = false,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size }))} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  // Full page spinner
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  // Overlay spinner
  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Page loader for route transitions
 */
export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}

/**
 * Button loader - small inline spinner for buttons
 */
export function ButtonLoader({ className }: { className?: string }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}

/**
 * Card loader with skeleton effect
 */
export function CardLoader() {
  return (
    <div className="relative overflow-hidden rounded-lg border p-6">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-20 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

export { spinnerVariants };

/**
 * Hotel PMS - Badge Component
 * Versatile badge/tag component with variants
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Badge variants for different states and styles
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Hotel-specific status variants
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        // Booking status variants
        confirmed:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        pending:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        cancelled:
          'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        'checked-in':
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        'checked-out':
          'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Badge component props
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // Optional remove button
  removable?: boolean;
  // Callback when remove is clicked
  onRemove?: () => void;
  // Icon to display before text
  icon?: React.ReactNode;
}

/**
 * Badge component for labels, tags, and status indicators
 */
function Badge({
  className,
  variant,
  size,
  removable,
  onRemove,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {/* Optional icon */}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {/* Remove button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 inline-flex items-center justify-center"
          aria-label="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };

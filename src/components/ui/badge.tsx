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

        // Strict Palette Mapping
        success:
          'border-transparent bg-primary text-white hover:bg-primary/90', // Mapped to Primary (Royal Blue)
        warning:
          'border-transparent bg-accent text-white hover:bg-accent/90', // Mapped to Accent (Gold)
        info:
          'border-transparent bg-primary/80 text-white hover:bg-primary',

        // Booking status variants - Mapped to soft versions of strict palette
        confirmed:
          'border-transparent bg-primary/10 text-primary border-primary/20',
        pending:
          'border-transparent bg-accent/10 text-accent-foreground border-accent/20',
        cancelled:
          'border-transparent bg-destructive/10 text-destructive border-destructive/20',
        'checked-in':
          'border-transparent bg-primary text-white',
        'checked-out':
          'border-transparent bg-secondary text-secondary-foreground',
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

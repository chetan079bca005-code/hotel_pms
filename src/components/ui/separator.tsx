/**
 * Hotel PMS - Separator Component
 * Visual divider using Radix UI
 */

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

/**
 * Separator component props
 */
export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  // Label to display in the middle of separator
  label?: string;
}

/**
 * Separator component for visual division
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, label, ...props },
    ref
  ) => {
    // Separator with label (like "or" dividers)
    if (label) {
      return (
        <div
          className={cn(
            'flex items-center',
            orientation === 'horizontal' ? 'w-full' : 'h-full flex-col'
          )}
        >
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              'shrink-0 bg-border',
              orientation === 'horizontal' ? 'h-[1px] flex-1' : 'w-[1px] flex-1',
              className
            )}
            {...props}
          />
          <span
            className={cn(
              'text-xs text-muted-foreground',
              orientation === 'horizontal' ? 'px-3' : 'py-3'
            )}
          >
            {label}
          </span>
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
              'shrink-0 bg-border',
              orientation === 'horizontal' ? 'h-[1px] flex-1' : 'w-[1px] flex-1',
              className
            )}
          />
        </div>
      );
    }

    // Simple separator without label
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

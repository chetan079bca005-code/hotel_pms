/**
 * Hotel PMS - Label Component
 * Form label component using Radix UI
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Label variants for different states
 */
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      // Error state for invalid fields
      error: {
        true: 'text-destructive',
        false: '',
      },
      // Required field indicator
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      required: false,
    },
  }
);

/**
 * Label component props
 */
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

/**
 * Label component for form fields
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, error, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ error, required }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
